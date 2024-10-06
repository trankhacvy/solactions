import { env } from "@/env";
import { Token } from "@/types";
import {
  createTransferInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import { TipLink } from "@tiplink/api";

const SOLANA_TRANSACTION_FEE_LAMPORTS = 6000; // to derive the real cost use: Connection.getFeeForMessage()

const TIPLINK_MINIMUM_LAMPORTS = 4083560;

const TIPLINK_SOL_ONLY_LINK_MINIMUM_LAMPORTS = 900000;

export async function createAndFundTiplink(
  wallet: PublicKey,
  amount: number,
  numOfLinks = 1,
  token: Token,
) {
  const tiplink = await TipLink.create();

  const transaction = new Transaction();

  if (token.isNative) {
    const lamports =
      amount * LAMPORTS_PER_SOL +
      numOfLinks * TIPLINK_SOL_ONLY_LINK_MINIMUM_LAMPORTS +
      SOLANA_TRANSACTION_FEE_LAMPORTS * 2; // 2 signer

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet,
        toPubkey: tiplink.keypair.publicKey,
        lamports,
      }),
    );
  } else {
    const mint = new PublicKey(token.address);

    const sourceAccount = getAssociatedTokenAddressSync(mint, wallet);

    const destAccount = getAssociatedTokenAddressSync(
      mint,
      tiplink.keypair.publicKey,
    );

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet,
        toPubkey: tiplink.keypair.publicKey,
        lamports:
          numOfLinks * TIPLINK_MINIMUM_LAMPORTS +
          SOLANA_TRANSACTION_FEE_LAMPORTS * 2,
      }),
      createAssociatedTokenAccountInstruction(
        wallet,
        destAccount,
        tiplink.keypair.publicKey,
        mint,
      ),
      createTransferInstruction(
        sourceAccount,
        destAccount,
        wallet,
        amount * 10 ** token.decimals,
        [],
      ),
    );
  }

  return {
    transaction,
    tiplink,
  };
}

export async function createSOLTiplink(payer: PublicKey, lamports: number) {
  const tiplink = await TipLink.create();

  const transaction = new Transaction();

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: tiplink.keypair.publicKey,
      lamports,
    }),
  );

  return {
    transaction,
    tiplink,
  };
}

export function getTiplinkBlinkUrl(id: string) {
  return `${env.NEXT_PUBLIC_FE_BASE_URL}/tiplink/${id}`;
}
