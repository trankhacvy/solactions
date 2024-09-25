import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { MetadataArgsArgs, mintToCollectionV1, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
  toWeb3JsInstruction,
  toWeb3JsKeypair,
  toWeb3JsTransaction,
} from "@metaplex-foundation/umi-web3js-adapters";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { tiplinkImages } from "@/config/constants";
import {
  buildTransferSolTx,
  buildTransferSplTx,
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
import dayjs from "dayjs";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import { uploadObject } from "@/app/actions/upload";

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
    console.log("c-nft", baseHref);

    let label = `Claim NFT`;

    // if (link.claimed) {
    //   label = "Claimed";
    // } else if (expired) {
    //   label = "Expired";
    // }

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

    // validate the client provided input
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

    console.log(metadata);

    const uploadResponse = await uploadObject(
      `${dispenser.userId}/dispense/${dispenser.id}`,
      metadata,
    );

    console.log({ uploadResponse });

    if (!uploadResponse.success) {
      return new Response("Tip link not found", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = getConnection();
    const umi = createUmi(connection)
      .use(mplTokenMetadata())
      .use(mplBubblegum())
      .use(keypairIdentity(fromWeb3JsKeypair(tiplink.keypair)));

    const mint = generateSigner(umi);

    const builder = await mintToCollectionV1(umi, {
      leafOwner: publicKey(claimant),
      merkleTree: publicKey(dispenser.merkleTreePublicKey),
      collectionMint: publicKey(dispenser.collectionMintPublicKeys ?? ""),
      metadata: {
        name: dispenser.name ?? "",
        uri: uploadResponse.result,
        sellerFeeBasisPoints: percentAmount(parseFloat(dispenser.royalty)),
        collection: {
          key: publicKey(dispenser.collectionMintPublicKeys ?? ""),
          verified: false,
        },
        creators: [
          {address: publicKey(claimant), verified: false, share: 100}
        ],
      } as unknown as MetadataArgsArgs,
    });

    const ixs = builder.getInstructions().map(toWeb3JsInstruction);

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

    // const ixs = toWeb3JsInstruction()

    // let transaction: Transaction;

    // if (link.token?.isNative) {
    //   transaction = await buildTransferSolTx(
    //     tiplink.keypair.publicKey,
    //     claimant,
    //     reference.publicKey,
    //     Number(link.amount),
    //     true,
    //   );
    // } else {
    //   transaction = await buildTransferSplTx(
    //     tiplink.keypair.publicKey,
    //     claimant,
    //     new PublicKey(link.token?.address!),
    //     reference.publicKey,
    //     Number(link.amount) * 10 ** link?.token?.decimals!,
    //     true,
    //   );
    // }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: transaction,
        message: "Claim Success",
      },
      signers: [toWeb3JsKeypair(mint), tiplink.keypair],
    });

    // api.tiplink.update({
    //   id: link.id,
    //   claimant: claimant.toBase58(),
    //   reference: reference.publicKey.toBase58(),
    // });

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
