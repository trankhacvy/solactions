"use client";

import React from "react";

import Stack from "@mui/material/Stack";

import { api, trpcVanilla } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import type { SelectDonationProfile, Token } from "@/types";
import { useSession } from "next-auth/react";
import { Routes } from "@/config/routes";
import { donateOptions, tokenList } from "@/config/tokens";
import { ProfilePreview } from "./profile-preview";
import { ProfileForm } from "./profile-form";
import { PublicKey } from "@solana/web3.js";
import { revalidateDonationProfile } from "@/app/actions/revalidate";

export function createProfileSchema(isEdit: boolean, userId?: string) {
  return z.object({
    image: z
      .string({ message: "Image is required." })
      .trim()
      .min(3, "Image is required"),
    wallet: z
      .string({ message: "Wallet is required." })
      .trim()
      .refine((wallet) => wallet && PublicKey.isOnCurve(wallet), {
        message: "Wallet is required.",
      }),
    name: z
      .string({ message: "Name is required." })
      .trim()
      .min(2, "Name is too short. Please enter at least 2 characters.")
      .max(80, "Name exceeds the maximum length of 80 characters."),
    slug: z
      .string()
      .trim()
      .min(3, "Username is too short. Please enter at least 3 characters.")
      .refine(
        async (slug) => {
          try {
            const profile = await trpcVanilla.donation.getBySlug.query({
              slug,
            });

            if (!profile) return true;

            return isEdit && profile.userId === userId;
          } catch (error) {
            console.error(error);
            return false;
          }
        },
        {
          message: "This username is already registered",
        },
      ),
    bio: z
      .string()
      .trim()
      .nullish()
      .refine((bio) => !bio || (!!bio && bio.length >= 3), {
        message: "Bio is too short. Please enter at least 3 characters.",
      }),
    amounts: z.array(
      z.object({
        value: z.coerce.number({ message: "Required" }).gt(0, "Invalid amount"),
      }),
    ),
    acceptToken: z
      .custom<Token>((value) => !!value, "This field is required.")
      .nullish(),
    thankMessage: z
      .string()
      .trim()
      .nullish()
      .refine(
        (thankMessage) =>
          !thankMessage || (!!thankMessage && thankMessage.length >= 3),
        {
          message:
            "Thank message is too short. Please enter at least 3 characters.",
        },
      ),
  });
}

export type ProfileSchema = ReturnType<typeof createProfileSchema>;

export function ProfileFormWrapper({
  profile,
}: {
  profile?: SelectDonationProfile;
}): JSX.Element {
  const { data: session, update } = useSession();
  const user = session?.user;
  const isEdit = !!profile;

  const methods = useForm<z.infer<ProfileSchema>>({
    resolver: zodResolver(createProfileSchema(isEdit, user?.id)),
    defaultValues: {
      image: isEdit ? profile.image ?? "" : user?.image ?? "",
      name: isEdit ? profile.name ?? "" : user?.name ?? "",
      slug: isEdit ? profile.slug : user?.screen_name ?? "",
      wallet: isEdit ? profile.wallet : "",
      bio: isEdit ? profile.bio : user?.description,
      amounts: isEdit
        ? profile.amountOptions.map((amount) => ({ value: parseFloat(amount) }))
        : donateOptions.map((option) => ({ value: option })),
      acceptToken: isEdit ? profile.acceptToken : tokenList[0],
      thankMessage: isEdit
        ? profile.thankMessage
        : "Thank you for your donation; you made my day. <3",
    },
  });

  const { handleSubmit, formState } = methods;

  const router = useRouter();

  const { mutate, isPending: isCreating } = api.donation.create.useMutation({
    onSuccess: async (data) => {
      if (data) {
        await update({ id: data.userId, wallet: data.wallet });
        router.replace(Routes.ADMIN);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } =
    api.donation.update.useMutation({
      onSuccess: async (data) => {
        if (data) {
          revalidateDonationProfile();
          router.replace(Routes.ADMIN);
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
          amountOptions: values.amounts.map((amount) => String(amount.value)),
        });
      } else {
        await mutate({
          ...values,
          amountOptions: values.amounts.map((amount) => String(amount.value)),
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
