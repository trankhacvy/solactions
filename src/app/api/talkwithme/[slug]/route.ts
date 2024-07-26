import { tokenList } from "@/config/tokens";
import { buildTransferSolTx, buildTransferSplTx } from "@/lib/transactions";
import { appendAddress } from "@/lib/helius";
import { api } from "@/trpc/server";
import { SelectDonationProfile, SelectKolProfileSchema  , Token } from "@/types";
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
    const kolProfile = await api.talkwithme.getBySlug({ slug: context.params.slug })
    if (!profile || !kolProfile) {
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
      `/api/talkwithme/${profile.slug}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      title: kolProfile.title ?? "",
      icon: profile.image ?? "",
      description: kolProfile.description ?? "",
      label: "Pay",
      links: {
        actions: [
          {
            label: "Pay",
            href: `${baseHref}?email={email}`,
            parameters: [
              {
                name: "email",
                label: "Enter your email",
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

    const { email, token } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();
    let kolprofile: SelectKolProfileSchema  | undefined;
    let profile: SelectDonationProfile | undefined;
    console.log(kolprofile)
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
    if (!kolprofile) {
      return Response.json(
        {
          error: true,
        },
        {
          headers: ACTIONS_CORS_HEADERS,
        },
      );
    }
    const amount: number = parseFloat(kolprofile.price);

    try {
      kolprofile = await api.talkwithme.getBySlug({
        slug: context.params.slug,
      });

      if (!kolprofile) {
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
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

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

    api.talkwithmeTransactions.create({
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
  let email: string | null = "";
  try {
    if (requestUrl.searchParams.get("email")) {
      email = requestUrl.searchParams.get("email");
    }
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
    email,
    token: token || tokenList[0]!,
  };
}
