import { PublicKey } from "@solana/web3.js";

export function isPublicKey(val: string) {
  try {
    return !!new PublicKey(val);
  } catch (error) {
    return false;
  }
}
