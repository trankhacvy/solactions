import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
  toWeb3JsInstruction,
  toWeb3JsKeypair,
} from "@metaplex-foundation/umi-web3js-adapters";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
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
  percentAmount,
} from "@metaplex-foundation/umi";
import { uploadObject } from "@/app/actions/upload";

type Params = {
  id: string;
};

export const GET = async (req: Request, context: { params: Params }) => {
  try {
    const requestUrl = new URL(req.url);

    const dispenser = await api.nftDispenser.getById({ id: context.params.id });

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

    const baseHref = new URL(
      `/api/nft-dispenser/${dispenser.id}`,
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

    const dispenser = await api.nftDispenser.getById({ id: context.params.id });

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

    const connection = getConnection();
    const umi = createUmi(connection)
      .use(mplTokenMetadata())
      .use(keypairIdentity(fromWeb3JsKeypair(tiplink.keypair)));

    const mint = generateSigner(umi);

    const builder = await createNft(umi, {
      mint,
      name: dispenser.name ?? "",
      symbol: dispenser.symbol ?? "",
      uri: uploadResponse.result,
      sellerFeeBasisPoints: percentAmount(parseFloat(dispenser.royalty)),
      tokenOwner: fromWeb3JsPublicKey(claimant),
      isCollection: dispenser.isCollection ?? false,
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

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: transaction,
        message: "Claim Success",
      },
      signers: [toWeb3JsKeypair(mint), tiplink.keypair],
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};