import { Token } from "@/types";
import { NATIVE_MINT } from "@solana/spl-token";

export const tokenList: Token[] = [
  {
    name: "Solana",
    symbol: "SOL",
    isNative: true,
    address: NATIVE_MINT.toBase58(),
    decimals: 9,
    icon: "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756",
  },
  {
    name: "USDC",
    symbol: "USDC",
    isNative: false,
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    icon: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
  },
];

export const donateOptions = [1, 3, 5];
