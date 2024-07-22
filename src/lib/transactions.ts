import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { env } from "@/env";

export function getConnection() {
  return new Connection(env.NEXT_PUBLIC_RPC_URL, "confirmed");
}

export const buildTransferSolTx = async (
  feePayer: PublicKey,
  receiver: PublicKey,
  reference: PublicKey,
  amount: number,
  receiverIsSigner: boolean
) => {
  const connection = getConnection();

  const transaction = new Transaction();

  const ix = SystemProgram.transfer({
    fromPubkey: feePayer,
    toPubkey: receiver,
    lamports: amount * LAMPORTS_PER_SOL,
  });

  ix.keys.push({
    pubkey: reference,
    isSigner: false,
    isWritable: false,
  });

  if (receiverIsSigner) {
    ix.keys.push({
      pubkey: receiver,
      isSigner: true,
      isWritable: true,
    });
  }

  transaction.add(ix);

  // set the end user as the fee payer
  transaction.feePayer = feePayer;

  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  return transaction;
};

export const buildTransferSplTx = async (
  sender: PublicKey,
  receiver: PublicKey,
  mint: PublicKey,
  reference: PublicKey,
  amount: number,
  receiverIsSigner: boolean
) => {
  const connection = getConnection();

  // TODO: verify token account
  const sourceAccount = getAssociatedTokenAddressSync(mint, sender);

  const destAccount = getAssociatedTokenAddressSync(mint, receiver);

  const transaction = new Transaction();
  transaction.feePayer = sender;

  const ix = createTransferInstruction(
    sourceAccount,
    destAccount,
    sender,
    amount,
    [],
  );

  ix.keys.push({
    pubkey: reference,
    isSigner: false,
    isWritable: false,
  });

  if (receiverIsSigner) {
    ix.keys.push({
      pubkey: receiver,
      isSigner: true,
      isWritable: true,
    });
  }

  transaction.add(ix);

  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  return transaction;
};
