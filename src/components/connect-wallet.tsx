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
        height: "40px",
      }}
      className="!h-10"
    />
  );
}
