"use client";

import dynamic from "next/dynamic";

export const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

export default function ConnectWalletButton() {
  return (
    <WalletMultiButtonDynamic
      style={{
        height: "36px",
        borderRadius: "8px",
      }}
      className="!h-10"
    />
  );
}
