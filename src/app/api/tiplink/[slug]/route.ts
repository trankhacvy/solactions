import { tiplinkImages } from "@/config/constants";
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
import dayjs from "dayjs";

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

    const expired = dayjs().isAfter(dayjs(link.expiredAt));

    const baseHref = new URL(
      `/api/tiplink/${link.id}`,
      requestUrl.origin,
    ).toString();

    let label = `Claim ${link.amount} ${link.token.symbol}`;

    if (link.claimed) {
      label = "Claimed";
    } else if (expired) {
      label = "Expired";
    }

    const payload: ActionGetResponse = {
      title: link.name ?? "",
      icon: link.image ?? tiplinkImages[1]?.image!,
      description: link.message ?? "",
      label,
      disabled: expired || link.claimed,
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

    const link = await api.tiplink.getById({ id: context.params.slug });

    if (!link) {
      return new Response("Tip link not found", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const tiplink = await TipLink.fromLink(link.link!);

    if (!tiplink) {
      return new Response("Tip link not found", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const reference = Keypair.generate();

    let transaction: Transaction;

    if (link.token?.isNative) {
      transaction = await buildTransferSolTx(
        tiplink.keypair.publicKey,
        claimant,
        reference.publicKey,
        Number(link.amount),
        true,
      );
    } else {
      transaction = await buildTransferSplTx(
        tiplink.keypair.publicKey,
        claimant,
        new PublicKey(link.token?.address!),
        reference.publicKey,
        Number(link.amount) * 10 ** link?.token?.decimals!,
        true,
      );
    }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Claim Success",
      },
      signers: [tiplink.keypair],
    });

    api.tiplink.update({
      id: link.id,
      claimant: claimant.toBase58(),
      reference: reference.publicKey.toBase58(),
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
