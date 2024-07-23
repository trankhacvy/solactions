import { IS_PRODUCTION } from "@/env";
import { Token } from "@/types";
import { NATIVE_MINT } from "@solana/spl-token";

const productionTokenList = [
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

const devTokenList = [
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
    symbol: "USDC-Dev",
    isNative: false,
    address: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    decimals: 6,
    icon: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
  },
];

export const tokenList: Token[] = IS_PRODUCTION
  ? productionTokenList
  : devTokenList;

export const defaultToken: Token = {
  name: "Solana",
  symbol: "SOL",
  isNative: true,
  address: NATIVE_MINT.toBase58(),
  decimals: 9,
  icon: "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756",
};

export const donateOptions = [1, 3, 5];
