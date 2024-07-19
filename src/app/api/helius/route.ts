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

  console.dir(body, { depth: null });

  if (body && body.length > 0) {
    const transaction = body[0]!;
    if (transaction.type === "TRANSFER" && !transaction.transactionError) {
      const accountKeys = transaction.accountData
        .filter((data) => data.nativeBalanceChange === 0)
        .map((acc) => acc.account);

      const transactions =
        await api.transaction.getPendingTransactionByReference({
          addresses: accountKeys,
        });

      if (transactions.length > 0) {
        await Promise.all(
          transactions.map((tx) =>
            api.transaction.updateByReference({
              status: "SUCCESS",
              reference: tx.reference,
            }),
          ),
        );
      }
    }
  }

  return NextResponse.json({ success: false });
}
