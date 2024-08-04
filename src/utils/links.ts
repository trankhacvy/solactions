import { env } from "@/env";

export const getDonationLink = (slug: string) =>
  `${env.NEXT_PUBLIC_FE_BASE_URL}/${slug}`;

export const getTalkwithmeLink = (slug: string) => 
  `${env.NEXT_PUBLIC_FE_BASE_URL}/api/talkwithme/${slug}`;