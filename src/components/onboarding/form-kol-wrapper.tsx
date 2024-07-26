"use client";

import React from "react";

import Stack from "@mui/material/Stack";

import { api, trpcVanilla } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import type { SelectKolProfileSchema, Token } from "@/types";
import { useSession } from "next-auth/react";
import { Routes } from "@/config/routes";
import { donateOptions, tokenList } from "@/config/tokens";
import { KolForm } from "./form-kol"
import { ProfileForm } from "./profile-form"
import { revalidateDonationProfile } from "@/app/actions/revalidate";

export function createProfileSchema(isEdit: boolean, userId?: string) {
    return z.object({
        slug: z
        .string({ message: "Title is required." })
        .trim()
        .min(2, "Title is too short. Please enter at least 2 characters.")
        .max(80, "Title exceeds the maximum length of 80 characters."),
        title: z
            .string({ message: "Title is required." })
            .trim()
            .min(2, "Title is too short. Please enter at least 2 characters.")
            .max(80, "Title exceeds the maximum length of 80 characters."),
        type: z.enum(["TELEGRAM", "CALENDLY"], { message: "Invalid type" }),
        description: z
            .string({ message: "Description is required." })
            .trim()
            .min(3, "Description is too short. Please enter at least 3 characters.")
            .max(255, "Description exceeds the maximum length of 255 characters."),
        calendyUrl: z
            .string({ message: "Calendly URL is required." })
            .trim()
            .min(2, "Calendly URL is too short. Please enter at least 2 characters.")
            .max(80, "Calendly URL exceeds the maximum length of 80 characters."),
        telegram_username: z
            .string({ message: "Telegram username is required." })
            .trim()
            .min(3, "Telegram username is too short. Please enter at least 3 characters.")
            .max(80, "Telegram username exceeds the maximum length of 80 characters."),
        price: z.array(
            z.object({
                value: z.coerce.number({ message: "Required" }).gt(0, "Invalid amount"),
            }),
            ),
        thankMessage: z
            .string()
            .trim()
            .default("You will receive a confirmation email after successful payment <3")
            .refine(
            (thankMessage) =>
                !!thankMessage && thankMessage.length >= 3,
            {
                message: "Thank message is too short. Please enter at least 3 characters.",
            },
            ),
    });
}

export type ProfileSchema = ReturnType<typeof createProfileSchema>;

export function KolFormWrapper({
  profile,
}: {
  profile?: SelectKolProfileSchema;
}): JSX.Element {
  const { data: session, update } = useSession();
  const user = session?.user;
  const isEdit = !!profile;
  console.log(user?.id)
  const methods = useForm<z.infer<ProfileSchema>>({
    resolver: zodResolver(createProfileSchema(isEdit, user?.id)),
    defaultValues: {
        title: isEdit ? profile.title ?? "" : user?.name ?? "",
        type: isEdit ? profile.type ?? "TELEGRAM" : "TELEGRAM",
        description: isEdit ? profile.description ?? "" : "",
        calendyUrl: isEdit ? profile.calendyUrl ?? "" : "",
        slug: isEdit ? profile.slug ?? "" : "",
        telegram_username: isEdit ? profile.telegram_username ?? "" : user?.screen_name ?? "",
        price: isEdit
        ? profile.priceOptions.map((price) => ({ value: parseFloat(price) }))
        : donateOptions.map((option) => ({ value: option })),
        thankMessage: isEdit ? profile.thankMessage ?? "" : "You will receive a confirmation email after successful payment <3",
    }
  });

  const { handleSubmit, formState } = methods;

  const router = useRouter();
  const { mutate, isPending: isCreating } = api.talkwithme.create.useMutation({
    onSuccess: async (data) => {
      if (data) {
        await update({ id: data.userId });
        router.replace(Routes.ADMIN);
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
            router.replace(Routes.ADMIN);
            }
        },
        onError: (error) => {
            console.error(error);
        },
        });
    async function onSubmit(values: z.infer<ProfileSchema>) {
        try {
            console.log("1")
        if (isEdit) {
            updateMutate({
            id: profile.id,
            ...values,
            priceOptions: values.price.map((amount) => String(amount.value)),
            });
        } else {
            await mutate({
            ...values,
            priceOptions: values.price.map((amount) => String(amount.value)),
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
