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
  verifySignatureInfoForIdentity,
} from "@solana/actions";

import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { TipLink } from "@tiplink/api";

type Params = {
  slug: string;
};

const identity = Keypair.fromSecretKey(
  Uint8Array.from([
    218, 114, 201, 162, 184, 160, 47, 242, 144, 135, 38, 233, 238, 43, 70, 155,
    29, 250, 235, 169, 135, 92, 106, 151, 26, 161, 46, 170, 179, 115, 117, 223,
    222, 70, 19, 110, 118, 163, 69, 5, 41, 200, 16, 24, 239, 77, 145, 165, 150,
    187, 124, 58, 41, 153, 122, 93, 164, 205, 199, 90, 73, 22, 221, 219,
  ]),
);

export const GET = async (req: Request, context: { params: Params }) => {
  try {
    const requestUrl = new URL(req.url);

    const link = await api.tiplink.getById({ id: context.params.slug });

    if (!link) {
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
      `/api/tiplink/${link.id}`,
      requestUrl.origin,
    ).toString();

    const baseImageUrl = process.env.VERCEL_URL
      ? new URL(`https://solactions.fun/`)
      : new URL(`http://localhost:${process.env.PORT || 3000}`);

    const payload: ActionGetResponse = {
      title: link.name ?? "",
      icon: `${baseImageUrl}/api/og?type=tiplink&id=${link.id}`,
      description: link.message ?? "",
      label: "Claim",
      disabled: !link.claimable,
      links: {
        actions: [
          {
            label: `Claim ${link.amountPerLink} ${link.token.symbol}`,
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
    let receiver: PublicKey;
    try {
      receiver = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const link = await api.tiplink.getById({ id: context.params.slug });

    if (!link) {
      return new Response("Link not found", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const tiplink = await TipLink.fromLink(link.link!);

    if (!tiplink) {
      return new Response("Link not found", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const reference = Keypair.generate();

    let transaction: Transaction;

    const amount = link.multiple ? link.amountPerLink : link.amount;

    if (link.token?.isNative) {
      transaction = await buildTransferSolTx(
        tiplink.keypair.publicKey,
        receiver,
        reference.publicKey,
        Number(amount) / 2,
      );
    } else {
      transaction = await buildTransferSplTx(
        tiplink.keypair.publicKey,
        receiver,
        new PublicKey(link.token?.address!),
        reference.publicKey,
        Number(amount) * 10 ** link?.token?.decimals!,
      );
    }

    // console.dir(transaction, { depth: null });

    const ref = Keypair.generate();

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Success",
      },
      signers: [tiplink.keypair],
      reference: ref.publicKey,
      actionIdentity: identity,
    });

    // console.log(payload);

    async function verify() {
      let success = false;
      try {
        const connection = getConnection();
        const signatureInfoes = await connection.getSignaturesForAddress(
          identity.publicKey,
        );

        console.log("signatureInfoes", signatureInfoes);

        signatureInfoes.forEach(async (info) => {
          success = await verifySignatureInfoForIdentity(
            connection,
            identity,
            info,
          );

          if (success) {
            return success;
          }
        });

        return success;
      } catch (error) {
        console.error(error);
      }

      return success;
    }

    // async function runVerification() {
    //   console.log("runVerification");
    //   let success = false;

    //   while (!success) {
    //     success = await verify();

    //     if (!success) {
    //       await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 1 second
    //     }
    //   }

    //   console.log("Verification succeeded!");
    // }

    // runVerification();

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
