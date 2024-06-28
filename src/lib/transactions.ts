import {
  clusterApiUrl,
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

export const buildTransferSolTx = async (
  feePayer: PublicKey,
  receiver: PublicKey,
  amount: number,
) => {
  const connection = new Connection(
    process.env.SOLANA_RPC! || clusterApiUrl("mainnet-beta"),
  );

  const transaction = new Transaction();
  transaction.feePayer = feePayer;

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: feePayer,
      toPubkey: receiver,
      lamports: amount * LAMPORTS_PER_SOL,
    }),
  );

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
  amount: number,
) => {
  const connection = new Connection(
    process.env.SOLANA_RPC! || clusterApiUrl("mainnet-beta"),
  );

  // TODO: verify token account
  const sourceAccount = getAssociatedTokenAddressSync(mint, sender);

  const destAccount = getAssociatedTokenAddressSync(mint, receiver);

  const transaction = new Transaction();
  transaction.feePayer = sender;

  transaction.add(
    createTransferInstruction(sourceAccount, destAccount, sender, amount, []),
  );

  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  return transaction;
};
