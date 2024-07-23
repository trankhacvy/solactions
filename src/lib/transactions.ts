import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  Account,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
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
  receiverIsSigner: boolean,
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
  receiverIsSigner: boolean,
) => {
  const connection = getConnection();
  const transaction = new Transaction();

  // TODO: verify token account
  const sourceAccount = getAssociatedTokenAddressSync(mint, sender);

  const destAccount = getAssociatedTokenAddressSync(mint, receiver);

  let _account: Account;
  try {
    _account = await getAccount(connection, destAccount);
  } catch (error: unknown) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
      try {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            sender,
            destAccount,
            receiver,
            mint,
          ),
        );
      } catch (error: unknown) {
        // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
        // instruction error if the associated account exists already.
      }
    } else {
      throw error;
    }
  }

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
  transaction.feePayer = sender;

  return transaction;
};
