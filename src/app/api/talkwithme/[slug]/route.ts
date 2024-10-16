import { tokenList } from "@/config/tokens";
import { buildTransferSolTx, buildTransferSplTx } from "@/lib/transactions";
import { appendAddress } from "@/lib/helius";
import { api } from "@/trpc/server";
import { SelectKolProfileSchema  } from "@/types";
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Resend } from "resend"
import { env } from "@/env";
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

    const { email} = validatedQueryParams(requestUrl);
    const body: ActionPostRequest = await req.json();

    let profile: SelectKolProfileSchema | undefined;
    try {
      profile = await api.talkwithme.getBySlug({
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

    if (profile.acceptToken.isNative) {
      transaction = await buildTransferSolTx(
        account,
        receiver,
        reference.publicKey,
        parseFloat(profile.price),
        false,
      );
    } else {
      transaction = await buildTransferSplTx(
        account,
        receiver,
        new PublicKey(profile.acceptToken.address),
        reference.publicKey,
        parseFloat(profile.price) * 10 ** profile.acceptToken.decimals,
        false,
      );
    }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: profile.thankMessage
          ? profile.thankMessage
          : `Send ${profile.price} ${profile.acceptToken.symbol} to ${receiver.toBase58()}.`,
      },
    });

    // insert to db
    api.talkwithmeTransactions.create({
      profileId: profile.id,
      sender: account.toBase58(),
      receiver: receiver.toBase58(),
      amount: String(profile.price),
      email: email,
      reference: reference.publicKey.toBase58(),
      currency: tokenList.find((t) => t.address === profile.acceptToken.address),
    });
    const resend = new Resend(env.RE_SEND_API);

    await resend.emails.send({
      from: 'Solaction <kay@kayx86.com>',
      to: email,
      subject: 'Confirm email',
      html: profile.calendyUrl,
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
  let email: string;

  try {
    const emailParam = requestUrl.searchParams.get("email");
    if (emailParam) {
      email = emailParam;
    } else {
      throw new Error("Email query parameter is missing");
    }
  } catch (err) {
    throw new Error("Invalid input query parameter: email");
  }
  
  return { email };
}