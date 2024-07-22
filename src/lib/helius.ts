import { env } from "@/env";
import { Helius } from "helius-sdk";

const helius = new Helius(env.HELIUS_API_KEY);

export function appendAddress(address: string) {
  return helius.appendAddressesToWebhook(env.HELIUS_WEBHOOK_ID, [address]);
}

export function removeAddress(address: string | string[]) {
  return helius.removeAddressesFromWebhook(env.HELIUS_WEBHOOK_ID, [...address]);
}

export async function getAllAddress() {
  const webhook = await helius.getWebhookByID(env.HELIUS_WEBHOOK_ID);
  console.log(
    "helius webhook: ",
    webhook.accountAddresses.length,
    webhook.accountAddresses,
  );
}
