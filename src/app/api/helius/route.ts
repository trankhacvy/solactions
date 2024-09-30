import { removeAddress } from "@/lib/helius";
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

      await Promise.all(
        accountKeys.map((key) =>
          findAndUpdateTransaction(key, transaction.signature),
        ),
      );
    }
  }

  return NextResponse.json({ success: false });
}

async function findAndUpdateTransaction(reference: string, signature: string) {
  try {
    const referenceInfo = await api.reference.getByReference({ reference });

    if (referenceInfo) {
      const type = referenceInfo.type;

      if (type === "DONATION") {
        const tx = await api.donationTransaction.getByReference({ reference });
        if (tx && tx.status !== "SUCCESS") {
          await api.donationTransaction.update({
            id: tx.id,
            status: "SUCCESS",
            signature,
          });
        }
      } else if (type === "TIPLINK") {
        const tiplink = await api.tiplink.getByReference({ reference });
        if (tiplink && !tiplink.claimed) {
          await api.tiplink.update({
            id: tiplink.id,
            status: "SUCCESS",
            claimed: true,
            signature,
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    removeAddress(reference)
  }
}
