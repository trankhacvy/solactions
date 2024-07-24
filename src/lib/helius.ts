import { env } from "@/env";
import { Helius } from "helius-sdk";

const helius = new Helius(env.HELIUS_API_KEY);

export function appendAddress(address: string) {
  try {
    return helius.appendAddressesToWebhook(env.HELIUS_WEBHOOK_ID, [address]);
  } catch (error) {
    console.error(error);
  }
}

export function removeAddress(address: string | string[]) {
  try {
    return helius.removeAddressesFromWebhook(env.HELIUS_WEBHOOK_ID, [
      ...address,
    ]);
  } catch (error) {
    console.error(error);
  }
}
