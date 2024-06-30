import { api } from "@/trpc/server";
import { NextRequest, NextResponse } from "next/server";

export type Body = Array<{
  accountData: Array<{
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: Array<any>;
  }>;
  description: string;
  events: {};
  fee: number;
  feePayer: string;
  instructions: Array<{
    accounts: Array<string>;
    data: string;
    innerInstructions: Array<any>;
    programId: string;
  }>;
  nativeTransfers: Array<{
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }>;
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: Array<{
    fromTokenAccount: string;
    fromUserAccount: string;
    mint: string;
    toTokenAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    tokenStandard: string;
  }>;
  transactionError: any;
  type: string;
}>;

export async function POST(req: NextRequest) {
  const body: Body = await req.json();
  // console.dir(body, { depth: null });

  if (body && body.length > 0) {
    const transaction = body[0]!;
    if (transaction.type === "TRANSFER" && !transaction.transactionError) {
      const nativeTranfer = transaction.nativeTransfers?.[0];
      const tokenTranfer = transaction.tokenTransfers?.[0];

      if (nativeTranfer) {
        const sender = nativeTranfer.fromUserAccount;
        const receiver = nativeTranfer.toUserAccount;

        const accountKeys = transaction.accountData
          .map((acc) => acc.account)
          .filter((acc) => acc !== sender && acc !== receiver);

        const donations = await api.donation.getPendingTransaction({
          receiver,
          addresses: accountKeys,
        });

        if (donations.length > 0) {
          await Promise.all(
            donations.map((donation) =>
              api.donation.updateByReference({
                status: "SUCCESS",
                reference: donation.reference,
              }),
            ),
          );

          return NextResponse.json({ success: true });
        }
      }

      if (tokenTranfer) {
        const sender = tokenTranfer.fromUserAccount;
        const senderTokenAccount = tokenTranfer.fromTokenAccount;

        const receiver = tokenTranfer.toUserAccount;
        const receiverTokenAccount = tokenTranfer.toTokenAccount;

        const accountKeys = transaction.accountData
          .map((acc) => acc.account)
          .filter(
            (acc) =>
              ![
                sender,
                receiver,
                senderTokenAccount,
                receiverTokenAccount,
                tokenTranfer.mint,
              ].includes(acc),
          );

        const donations = await api.donation.getPendingTransaction({
          receiver,
          addresses: accountKeys,
        });

        if (donations.length > 0) {
          await Promise.all(
            donations.map((donation) =>
              api.donation.updateByReference({
                status: "SUCCESS",
                reference: donation.reference,
              }),
            ),
          );

          return NextResponse.json({ success: true });
        }
      }
    }
  }

  return NextResponse.json({ success: false });
}
