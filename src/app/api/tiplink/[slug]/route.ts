import { appendAddress, getAllAddress } from "@/lib/helius";
import { buildTransferSolTx, buildTransferSplTx } from "@/lib/transactions";
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

type Params = {
  slug: string;
};

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
    let claimant: PublicKey;
    try {
      claimant = new PublicKey(body.account);
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

    await getAllAddress();

    await appendAddress(reference.publicKey.toBase58());

    await getAllAddress();

    let transaction: Transaction;

    const amount = link.multiple ? link.amountPerLink : link.amount;

    if (link.token?.isNative) {
      transaction = await buildTransferSolTx(
        tiplink.keypair.publicKey,
        claimant,
        reference.publicKey,
        Number(amount) / 2,
      );
    } else {
      transaction = await buildTransferSplTx(
        tiplink.keypair.publicKey,
        claimant,
        new PublicKey(link.token?.address!),
        reference.publicKey,
        Number(amount) * 10 ** link?.token?.decimals!,
      );
    }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Claim Success",
      },
      signers: [tiplink.keypair],
    });

    api.tiplinkClaim.create({
      tiplinkId: link.id,
      claimant: claimant.toBase58(),
      reference: reference.publicKey.toBase58(),
      claimAt: new Date(),
    });

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
