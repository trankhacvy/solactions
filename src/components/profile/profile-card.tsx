"use client";

import {
  ActionGetResponse,
  ActionPostResponse,
  LinkedAction,
} from "@solana/actions";
import { SelectDonationProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import fetcher from "@/lib/fetcher";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { BlinkActionStatus, BlinkCard } from "../blink";

export function ProfileCard({ profile }: { profile: SelectDonationProfile }) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();

  const [status, setStatus] = useState<BlinkActionStatus>(
    BlinkActionStatus.IDLE,
  );

  const { data, isFetching } = useQuery({
    queryKey: ["action", profile.slug],
    queryFn: () => fetcher<ActionGetResponse>(`/api/profile/${profile.slug}`),
    refetchOnWindowFocus: false,
  });

  const handleClick = async (action: LinkedAction) => {
    try {
      if (!publicKey) {
        setVisible(true);
        return;
      }

      setStatus(BlinkActionStatus.PROCESSING);

      const response = await fetcher<ActionPostResponse>(action.href, {
        method: "POST",
        body: JSON.stringify({
          account: publicKey!.toBase58(),
        }),
      });

      const transaction = Transaction.from(
        Buffer.from(response.transaction, "base64"),
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      transaction.feePayer = publicKey;
      transaction.recentBlockhash = blockhash;

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      console.info("Transaction sent:", signature);

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      console.info("Transaction successful!", signature);

      setStatus(BlinkActionStatus.SUCCESS);

      setTimeout(() => {
        setStatus(BlinkActionStatus.IDLE);
      }, 1000);
    } catch (error) {
      setStatus(BlinkActionStatus.FAILED);
      console.error(error);
    }
  };

  if (!data) return null;

  return <BlinkCard actions={data} onClick={handleClick} status={status} />;
}
