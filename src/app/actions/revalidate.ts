"use server";

import { revalidatePath } from "next/cache";

export const revalidateDonationProfile = () => {
  revalidatePath(`/admin`);
  revalidatePath(`/admin/edit`);
  revalidatePath(`/admin/settings`);
  revalidatePath(`/[slug]`);
};
