"use client";

import { Button, Stack, Card, CardContent, Box, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
// import FormNumberInput from "@/components/ui/form-number-input";
import { FormInput, FormNumberInput } from "@/components/ui/form-input";
import { FormTokenSelect } from "@/components/ui/form-token-select";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, get, useForm } from "react-hook-form";
import * as z from "zod";

import { useRouter } from "next/navigation";
import { defaultToken, tokenList } from "@/config/tokens";
import { Token } from "@/types";
import Link from "next/link";
import { Routes } from "@/config/routes";
import { zodNumberInputPipe } from "@/utils/zod";
import { createAndFundTiplink } from "@/lib/tiplink";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { sendAndConfirmTransaction } from "@solana/web3.js";
import { getConnection } from "@/lib/transactions";
import { FormCustomRadioGroup } from "../ui/form-custom-radio-group";
import ConnectWalletButton from "../connect-wallet";

enum TipType {
  Single = "single",
  Multiple = "multiple",
}

export const NewTiplinkSchema = z.object({
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
  type: z.nativeEnum(TipType).default(TipType.Single),
  numOfClaims: zodNumberInputPipe(
    z
      .number()
      .gt(1, "Number of claims must be greater than 1.")
      .lte(100, "Number of claims must be less than or equal to 100"),
  ),
});

export default function NewTipLinkForm() {
  const theme = useTheme();
  const tprcUtils = api.useUtils();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof NewTiplinkSchema>>({
    resolver: zodResolver(NewTiplinkSchema),
    defaultValues: {
      message: "",
      amount: 1,
      token: defaultToken,
      type: TipType.Single,
      numOfClaims: 2,
    },
  });

  const wType = watch("type");
  const wAmount = watch("amount");
  const wNumOfClaims = watch("numOfClaims");
  const wToken = watch("token");

  const router = useRouter();

  const { mutate, isPending } = api.tiplink.create.useMutation({
    onSuccess: async (data) => {
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
      console.log("values: ", values);
      const numOfClaims =
        values.type === TipType.Single ? 1 : values.numOfClaims;

      const { tiplink, transaction } = await createAndFundTiplink(
        publicKey,
        values.amount,
        numOfClaims,
        values.token,
      );
      console.log("tiplink", tiplink.url.toString());

      const signature = await sendTransaction(transaction, connection);
      console.log("signature", signature);

      const response = await connection.confirmTransaction(
        signature,
        "confirmed",
      );

      console.log("response", response);

      await mutate({
        name: "Tiplink",
        message: values.message,
        amount: String(values.amount),
        amountPerLink: String(Number(values.amount) / Number(numOfClaims)),
        token: values.token as Token,
        multiple: values.type === TipType.Multiple,
        numOfClaims,
        link: tiplink.url.toString(),
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ maxWidth: theme.breakpoints.values.md, mx: "auto" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <FormCustomRadioGroup
                {...field}
                options={[
                  {
                    label: "Single",
                    value: TipType.Single,
                  },
                  {
                    label: "Multiple",
                    value: TipType.Multiple,
                  },
                ]}
                label="Type"
                id="type"
                onChange={(_, data) => field.onChange(data)}
                error={!!errors.type}
                helperText={errors.type?.message as string | undefined}
              />
            )}
          />

          {wType === TipType.Multiple && (
            <Controller
              control={control}
              name="numOfClaims"
              render={({ field }) => (
                <Controller
                  control={control}
                  name="numOfClaims"
                  render={({ field }) => (
                    <FormNumberInput
                      {...field}
                      fullWidth
                      placeholder="Enter number of claims"
                      label="Number of claims"
                      allowNegative={false}
                      decimalScale={0}
                      min={0}
                      max={100}
                      error={!!errors.numOfClaims}
                      helperText={
                        !!get(errors, "numOfClaims")
                          ? get(errors, "numOfClaims").message ?? ""
                          : wAmount && wAmount > 0
                            ? `${(wAmount / wNumOfClaims).toFixed(3)} ${wToken.symbol} per claim`
                            : ""
                      }
                    />
                  )}
                />
              )}
            />
          )}

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
