"use server";

import { appendAddress } from "@/lib/helius";
import { UploadActionResponse } from "@/types";

export async function appendWebhookAddress(
  formData: FormData,
): Promise<UploadActionResponse> {
  try {
    const address = formData.get("address") as string;

    if (!address) {
      return {
        success: false,
        error: `'address' are required`,
      };
    }

    await appendAddress(address);

    return {
      success: true,
      result: "",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message ?? "Unknown error",
    };
  }
}
