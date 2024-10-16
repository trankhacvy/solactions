"use client";

import React from "react";

import Stack from "@mui/material/Stack";

import { api, trpcVanilla } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import type { SelectKolProfileSchema , Token } from "@/types";
import { useSession } from "next-auth/react";
import { Routes } from "@/config/routes";
import { donateOptions, tokenList } from "@/config/tokens";
import { ProfilePreview } from "./profile-preview";
import { ProfileForm } from "./profile-form";
import { revalidateDonationProfile } from "@/app/actions/revalidate";

const createProfileSchema = (isEdit: boolean, userId?: string) => z.object({
  image: z
    .string({ message: "Image is required." })
    .trim()
    .min(3, "Image is required"),
  title: z.string(),
  description: z.string(),
  type: z.enum(["TELEGRAM", "CALENDLY"]),
  calendyUrl: z.string(),
  telegram_username: z.string(),
  duration: z.string(),
  price: z.string(),
  slug: z.string(),
  acceptToken: z.any().optional(),
  thankMessage: z.string().nullable().optional(),
});
export type ProfileSchema = ReturnType<typeof createProfileSchema>;

export function ProfileFormWrapper({
  profile,
}: {
  profile?: SelectKolProfileSchema;
}): JSX.Element {
  const { data: session, update } = useSession();
  const user = session?.user;
  const isEdit = !!profile;
  const methods = useForm<z.infer<ProfileSchema>>({
    resolver: zodResolver(createProfileSchema(isEdit, user?.id)),
    defaultValues: {
      image: isEdit ? profile.image ?? "" : user?.image ?? "",
      title: isEdit ? profile.title : "",
      description: isEdit ? profile.description : "",
      calendyUrl: isEdit ? profile.calendyUrl : "",
      telegram_username: isEdit ? profile.telegram_username : "",
      slug: isEdit ? profile.slug : user?.screen_name ?? "",
      duration: isEdit ? profile.duration : "",
      price: isEdit ? profile.price : "", 
      acceptToken: isEdit ? profile.acceptToken : tokenList[0],
      thankMessage: isEdit
        ? profile.thankMessage
        : "You will receive a confirmation email after successful payment <3",
    },
  });

  const { handleSubmit, formState } = methods;
  const router = useRouter();

  const { mutate, isPending: isCreating } = api.talkwithme.create.useMutation({
    onSuccess: async (data) => {
      if (data) {
        await update({ id: data.userId });
        router.replace(Routes.ADMIN_KOL_HOME);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } =
    api.talkwithme.update.useMutation({
      onSuccess: async (data) => {
        if (data) {
          revalidateDonationProfile();
          router.replace(Routes.ADMIN_KOL_STREAM);
        }
      },
      onError: (error) => {
        console.error(error);
      },
    });

  async function onSubmit(values: z.infer<ProfileSchema>) {
    try {
      if (isEdit) {
        updateMutate({
          id: profile.id,
          ...values,
        });
      } else {
        mutate({
          ...values,
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="flex-start"
            gap={4}
          >
            <ProfilePreview />
            <ProfileForm
              isEdit={isEdit}
              loading={formState.isSubmitting || isCreating || isUpdating}
            />
          </Stack>
        </form>
      </FormProvider>
    </>
  );
}