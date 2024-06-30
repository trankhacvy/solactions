"use server";

import { revalidatePath } from "next/cache";

export const revalidateUser = () => {
  revalidatePath(`/admin`);
  revalidatePath(`/admin/edit`);
  revalidatePath(`/admin/settings`);
  revalidatePath(`/[slug]`);
};
