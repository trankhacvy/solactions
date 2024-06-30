import { env } from "@/env";
import { Helius } from "helius-sdk";

const helius = new Helius(env.HELIUS_API_KEY);

export function appendAddress(address: string) {
  return helius.appendAddressesToWebhook(env.HELIUS_WEBHOOK_ID, [address]);
}
