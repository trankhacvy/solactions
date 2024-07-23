import { env } from "@/env";
import { Helius } from "helius-sdk";

const helius = new Helius(env.HELIUS_API_KEY);

export function appendAddress(address: string) {
  try {
    console.log("append: ", address);
    return helius.appendAddressesToWebhook(env.HELIUS_WEBHOOK_ID, [address]);
  } catch (error) {
    console.error(error);
  }
}

export function removeAddress(address: string | string[]) {
  try {
    console.log("remove: ", address);
    return helius.removeAddressesFromWebhook(env.HELIUS_WEBHOOK_ID, [
      ...address,
    ]);
  } catch (error) {
    console.error(error);
  }
}
