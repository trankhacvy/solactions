import { PublicKey } from "@solana/web3.js";

export function getExplorerUrl(
  env: "mainnet" | "devnet" = "mainnet",
  viewTypeOrItemAddress: "inspector" | PublicKey | string,
  itemType = "address", // | 'tx' | 'block'
) {
  let cluster = "";
  if (env === "devnet") {
    cluster = "?cluster=devnet";
  }

  return `https://explorer.solana.com/${itemType}/${viewTypeOrItemAddress}${cluster}`;
}
