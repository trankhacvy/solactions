"use client";

import {
  Button,
  Stack,
  Card,
  CardContent,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { FormInput, FormNumberInput } from "@/components/ui/form-input";
import { FormTokenSelect } from "@/components/ui/form-token-select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { useRouter } from "next/navigation";
import { defaultToken, tokenList } from "@/config/tokens";
import { Token } from "@/types";
import Link from "next/link";
import { Routes } from "@/config/routes";
import { zodNumberInputPipe } from "@/utils/zod";
import { createAndFundTiplink } from "@/lib/tiplink";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "../connect-wallet";
import { appendWebhookAddress } from "@/app/actions/helius";
import { tiplinkImages } from "@/config/constants";

export const NewTiplinkSchema = z.object({
  imageIndex: z.coerce.number(),
  message: z
    .string()
    .trim()
    .nullable()
    .refine((val) => !val || val.length >= 3, {
      message: "Message is too short. Please enter at least 3 characters.",
    }),
  amount: zodNumberInputPipe(
    z.number().gt(0, "Amount must be greater than 0."),
  ),
  token: z.custom<Token>((value) => !!value, "Token field is required."),
});

export default function NewTipLinkForm() {
  const theme = useTheme();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof NewTiplinkSchema>>({
    resolver: zodResolver(NewTiplinkSchema),
    defaultValues: {
      imageIndex: 0,
      message: "",
      amount: 1,
      token: defaultToken,
    },
  });

  const router = useRouter();

  const { mutate, isPending } = api.tiplink.create.useMutation({
    onSuccess: async (_data) => {
      router.replace(Routes.ADMIN_TIPLINKS);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  async function onSubmit(values: z.infer<typeof NewTiplinkSchema>) {
    try {
      if (!publicKey) {
        alert("Please connect your wallet");
        return;
      }

      const { tiplink, transaction } = await createAndFundTiplink(
        publicKey,
        values.amount,
        1,
        values.token,
      );

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "confirmed");

      const image = tiplinkImages?.[values.imageIndex];
      await mutate({
        message: values.message,
        amount: String(values.amount),
        token: values.token as Token,
        link: tiplink.url.toString(),
        name: image?.title,
        image: image?.image,
      });

      const formData = new FormData();
      formData.append("address", tiplink.keypair.publicKey.toBase58());
      appendWebhookAddress(formData);
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ maxWidth: theme.breakpoints.values.md, mx: "auto" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Controller
            control={control}
            name="imageIndex"
            render={({ field }) => <ImagesCarousel {...field} />}
          />

          <FormInput
            {...register("message")}
            fullWidth
            placeholder="Message for receiver"
            label="Message"
            error={!!errors.message}
            rows={5}
            multiline
            helperText={errors.message?.message}
          />

          <Stack flexDirection="row" gap={3}>
            <Box flex={{ xs: 1, md: 2, lg: 3 }}>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <FormNumberInput
                    {...field}
                    fullWidth
                    placeholder="Enter amount"
                    allowNegative={false}
                    min={0}
                    label="Amount"
                    error={!!errors.amount}
                    helperText={errors.amount?.message as string | null}
                  />
                )}
              />
            </Box>
            <Box flex={1}>
              <Controller
                name="token"
                control={control}
                render={({ field }) => (
                  <FormTokenSelect
                    {...field}
                    options={tokenList}
                    label="Token"
                    id="token"
                    fullWidth
                    onChange={(_, data) => field.onChange(data)}
                    error={!!errors.token}
                    helperText={errors.token?.message as string | undefined}
                  />
                )}
              />
            </Box>
          </Stack>

          <Stack flexDirection="row" gap={2} justifyContent="flex-end">
            <Link href={Routes.ADMIN_TIPLINKS} replace>
              <Button variant="outlined">Cancel</Button>
            </Link>

            {publicKey ? (
              <LoadingButton
                loading={isSubmitting || isPending}
                variant="contained"
                type="submit"
              >
                Create
              </LoadingButton>
            ) : (
              <ConnectWalletButton />
            )}
          </Stack>
        </CardContent>
      </Card>
    </form>
  );
}

function ImagesCarousel({ value, onChange }: any) {
  const theme = useTheme();

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      width="100%"
    >
      <CarouselContent sx={{ gap: 2 }}>
        {tiplinkImages.map((item, idx) => (
          <CarouselItem
            key={item.key}
            sx={{
              flexBasis: `${100 / 3}%`,
            }}
          >
            <Box p="4px">
              <Box
                sx={{
                  boxShadow:
                    idx === value
                      ? `0 0 0 2px ${theme.palette.text.primary}`
                      : "none",
                  aspectRatio: "square",
                }}
                border={`1px solid ${alpha(theme.palette.grey[500], 0.16)}`}
                borderRadius={1}
                onClick={() => onChange(idx)}
              >
                <Box
                  component="img"
                  src={item.image}
                  sx={{
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious sx={{ mt: 1 }} />
      <CarouselNext sx={{ mt: 1 }} />
    </Carousel>
  );
}
