import * as schema from "@/db";

export type SelectUser = typeof schema.usersV2.$inferSelect;

export type SelectDonationProfile = typeof schema.donationProfile.$inferSelect;

// upload action
export type UploadActionResponse = {
  success: boolean;
  error?: string;
} & ({ success: true; result: string } | { success: false });

// token

export type Token = {
  name: string;
  symbol: string;
  address: string;
  isNative: boolean;
  decimals: number;
  icon: string;
};
