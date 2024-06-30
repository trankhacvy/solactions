import { donateOptions, tokenList } from "@/config/tokens";
import { buildTransferSolTx, buildTransferSplTx } from "@/lib/transactions";
import { api } from "@/trpc/server";
import { SelectUser, Token } from "@/types";
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

    const user = await api.user.getBySlug({ slug: context.params.slug });

    if (!user) {
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
      `/api/profile/${user.slug}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      title: user.name ?? "",
      icon: user.avatar ?? "",
      description: user.bio ?? "",
      label: "Transfer",
      links: {
        actions: [
          ...donateOptions.map((option) => ({
            label: `${option} ${user.acceptToken?.symbol}`,
            href: `${baseHref}?amount=${option}${user.acceptToken?.isNative ? "" : `&token=${user.acceptToken?.address}`}`,
          })),
          {
            label: "Donate",
            href: `${baseHref}?amount={amount}${user.acceptToken?.isNative ? "" : `&token=${user.acceptToken?.address}`}`,
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
    const requestUrl = new URL(req.url);

    const { amount, token } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    let receiverUser: SelectUser | undefined;
    try {
      receiverUser = await api.user.getBySlug({
        slug: context.params.slug,
      });

      if (!receiverUser) {
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
      receiver = new PublicKey(receiverUser.wallet);
    } catch (err) {
      return new Response('Invalid "receiver" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    // ensure the receiving account will be rent exempt
    // const minimumBalance = await connection.getMinimumBalanceForRentExemption(
    //   0, // note: simple accounts that just store native SOL have `0` bytes of data
    // );

    // if (amount * LAMPORTS_PER_SOL < minimumBalance) {
    //   throw `account may not be rent exempt: ${receiver.toBase58()}`;
    // }

    const reference = Keypair.generate();

    let transaction;

    if (token.isNative) {
      transaction = await buildTransferSolTx(
        account,
        receiver,
        reference.publicKey,
        amount,
      );
    } else {
      transaction = await buildTransferSplTx(
        account,
        receiver,
        new PublicKey(token.address),
        reference.publicKey,
        amount * 10 ** token.decimals,
      );
    }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} ${token.symbol} to ${receiver.toBase58()}. ${receiverUser.thankMessage}`,
      },
    });

    // console.dir(transaction, { depth: null });

    // insert to db
    await api.donation.createNew({
      userId: receiverUser.id,
      sender: account.toBase58(),
      receiver: receiver.toBase58(),
      amount: String(amount),
      reference: reference.publicKey.toBase58(),
      currency: token.address,
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
