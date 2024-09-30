import * as schema from "@/db";

export type SelectUser = typeof schema.user.$inferSelect;

export type SelectDonationProfile = typeof schema.donationProfile.$inferSelect;

export type SelectKolProfileSchema = typeof schema.kolProfile.$inferSelect;
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

export type Creator = { address: string; verified: boolean; share: number };

export type Property = { name: string; value: string };
