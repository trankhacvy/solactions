import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { none, percentAmount } from '@metaplex-foundation/umi';
import { createTree, MetadataArgsArgs, mintToCollectionV1, mintV1, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';
import {
  fromWeb3JsKeypair,
  toWeb3JsInstruction,
  toWeb3JsKeypair,
} from "@metaplex-foundation/umi-web3js-adapters";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
 
  getConnection,
} from "@/lib/transactions";
import { api } from "@/trpc/server";
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";

import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { TipLink } from "@tiplink/api";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { uploadObject } from "@/app/actions/upload";
// import bs58 from "bs58";

type Params = {
  id: string;
};

export const GET = async (req: Request, context: { params: Params }) => {
  try {
    const requestUrl = new URL(req.url);

    const dispenser = await api.cnftDispenser.getById({ id: context.params.id });

    if (!dispenser) {
      return Response.json(
        {
          error: true,
        },
        {
          headers: ACTIONS_CORS_HEADERS,
        },
      );
    }

    // const expired = dayjs().isAfter(dayjs(link.expiredAt));

    const baseHref = new URL(
      `/api/c-nft-dispenser/${dispenser.id}`,
      requestUrl.origin,
    ).toString();

    let label = `Claim NFT`;
    
    const payload: ActionGetResponse = {
      title: dispenser.name ?? "",
      icon: dispenser.media ?? "",
      description: dispenser.description ?? "",
      label,
      disabled: false,
      links: {
        actions: [
          {
            label,
            href: baseHref,
          },
        ],
      },
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export const OPTIONS = GET;

export const POST = async (req: Request, context: { params: Params }) => {
  try {
    const body: ActionPostRequest = await req.json();

    let claimant: PublicKey;
    try {
      claimant = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
    const dispenser = await api.cnftDispenser.getById({ id: context.params.id });

    if (!dispenser) {
      return new Response("URL not found", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const tiplink = await TipLink.fromLink(dispenser.link!);
    if (!tiplink) {
      return new Response("Tip link not found", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    // upload metadata

    const metadata = {
      name: dispenser.name,
      description: dispenser.description,
      image: dispenser.media,
      external_url: dispenser.externalUrl,
      attributes:
        dispenser.properties?.map((item) => ({
          trait_type: item.name,
          value: item.value,
        })) ?? [],
      properties: {
        files: [
          {
            uri: dispenser.media,
            type: "image/png",
          },
        ],
        category: "image",
      },
    };

    const uploadResponse = await uploadObject(
      `${dispenser.userId}/dispense/${dispenser.id}`,
      metadata,
    );

    if (!uploadResponse.success) {
      return new Response("Tip link not found", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    // const keypair = Keypair.fromSecretKey(
    //   bs58.decode(
    //     process.env.SOLANA_PRIVATE_KEY || ""
    //   )
    // );

    console.log("tiplink keypair public key", tiplink.keypair.publicKey.toBase58());

    const connection = getConnection();
    const umi = createUmi(connection)
      .use(mplTokenMetadata())
      .use(mplBubblegum())
      .use(keypairIdentity(fromWeb3JsKeypair(tiplink.keypair)));
    let builder;
    if(!dispenser.collectionMintPublicKeys){
      const merkleTree = generateSigner(umi);
      const builders = await createTree(umi, {
        merkleTree,
        maxDepth: 5,
        maxBufferSize: 8,
      });
      await builders.sendAndConfirm(umi)
      console.log("minting without collection");
      builder = await mintV1(umi, {
        leafOwner: publicKey(claimant),
        merkleTree: merkleTree.publicKey,
        metadata: {
          name: dispenser.name ?? "",
          uri: uploadResponse.result,
          sellerFeeBasisPoints: 500,
          collection: none(),
          creators: [
            {address: umi.identity.publicKey, verified: false, share: 100}
          ],
        },
      });
    } else {
      console.log("minting with collection");

      const merkleTree = generateSigner(umi);
      const builders = await createTree(umi, {
        merkleTree,
        maxDepth: 5,
        maxBufferSize: 8,
      });
      await builders.sendAndConfirm(umi);
      console.log("merkleTree", merkleTree.publicKey);
    
      const collectionMint = generateSigner(umi);
      console.log("collectionMint", collectionMint);
      await createNft(umi, {
        mint: collectionMint,
        name: dispenser.name ?? '',
        uri: uploadResponse.result,
        sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
        isCollection: true,
      }).sendAndConfirm(umi);

      console.log("collection mint public key", collectionMint.publicKey);
      builder = await mintToCollectionV1(umi, {
        leafOwner: publicKey(claimant),
        merkleTree: merkleTree.publicKey,
        collectionMint: collectionMint.publicKey,
        metadata: {
          name: dispenser.name ?? "",
          uri: uploadResponse.result,
          sellerFeeBasisPoints: 500,
          collection: {
            key: collectionMint.publicKey,
            verified: false,
          },
          creators: [ 
            {address: publicKey(claimant), verified: false, share: 100}
          ],
        } as MetadataArgsArgs,
      });
    }
    
    const ixs = await builder.getInstructions().map(toWeb3JsInstruction);

    const reference = Keypair.generate();

    ixs.forEach((ix) => {
      if (
        ix.keys.some((key) => key.pubkey.toBase58() === claimant.toBase58())
      ) {
        ix.keys.push({
          pubkey: reference.publicKey,
          isSigner: false,
          isWritable: false,
        });

        ix.keys.push({
          pubkey: claimant,
          isSigner: true,
          isWritable: true,
        });
      }
    });
  
    const transaction = new Transaction().add(...ixs);

    transaction.feePayer = tiplink.keypair.publicKey;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    console.dir(transaction, { depth: null });

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: transaction,
        message: "Claim Success",
      },
      signers: [tiplink.keypair],
    });

    console.log(payload);

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
