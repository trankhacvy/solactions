import { tokenList } from "@/config/tokens";
import { appendAddress } from "@/lib/helius";
import { buildTransferSolTx, buildTransferSplTx } from "@/lib/transactions";
import { api } from "@/trpc/server";
import { SelectDonationProfile, Token } from "@/types";
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";

import { Keypair, PublicKey } from "@solana/web3.js";

const DEFAULT_SOL_AMOUNT: number = 0.001;

type Params = {
  slug: string;
};

export const GET = async (req: Request, context: { params: Params }) => {
  try {
    const requestUrl = new URL(req.url);

    const profile = await api.donation.getBySlug({ slug: context.params.slug });

    if (!profile) {
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
      `/api/profile/${profile.slug}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      title: profile.name ?? "",
      icon: profile.image ?? "",
      description: profile.bio ?? "",
      label: "Transfer",
      links: {
        actions: [
          ...profile.amountOptions.map((option) => ({
            label: `${option} ${profile.acceptToken?.symbol}`,
            href: `${baseHref}?amount=${option}${profile.acceptToken?.isNative ? "" : `&token=${profile.acceptToken?.address}`}`,
          })),
          {
            label: "Donate",
            href: `${baseHref}?amount={amount}${profile.acceptToken?.isNative ? "" : `&token=${profile.acceptToken?.address}`}`,
            parameters: [
              {
                name: "amount",
                label: "Enter the amount to send",
                required: true,
              },
            ],
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
    const requestUrl = new URL(req.url);

    const { amount, token } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    let profile: SelectDonationProfile | undefined;
    try {
      profile = await api.donation.getBySlug({
        slug: context.params.slug,
      });

      if (!profile) {
        return new Response('Invalid "receiver" provided', {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }
    } catch (err) {
      console.error(err);
      return new Response('Invalid "receiver" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    // validate the client provided input
    let receiver: PublicKey;
    try {
      receiver = new PublicKey(profile.wallet);
    } catch (err) {
      return new Response('Invalid "receiver" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const reference = Keypair.generate();
    await appendAddress(account.toBase58());

    let transaction;

    if (token.isNative) {
      transaction = await buildTransferSolTx(
        account,
        receiver,
        reference.publicKey,
        amount,
        false,
      );
    } else {
      transaction = await buildTransferSplTx(
        account,
        receiver,
        new PublicKey(token.address),
        reference.publicKey,
        amount * 10 ** token.decimals,
        false,
      );
    }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: profile.thankMessage
          ? profile.thankMessage
          : `Send ${amount} ${token.symbol} to ${receiver.toBase58()}.`,
      },
    });

    // insert to db
    api.donationTransaction.create({
      profileId: profile.id,
      sender: account.toBase58(),
      receiver: receiver.toBase58(),
      amount: String(amount),
      reference: reference.publicKey.toBase58(),
      currency: tokenList.find((t) => t.address === token.address),
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

function validatedQueryParams(requestUrl: URL) {
  let amount: number = DEFAULT_SOL_AMOUNT;

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount")!);
    }

    if (amount <= 0) throw "amount is too small";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  let token: Token | undefined;

  try {
    if (requestUrl.searchParams.get("token")) {
      const address = requestUrl.searchParams.get("token");
      token = tokenList.find((t) => t.address === address);
    }
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  return {
    amount,
    token: token || tokenList[0]!,
  };
}
