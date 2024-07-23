"use client";

import React, { useEffect } from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { alpha, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FormTokenSelect } from "@/components/ui/form-token-select";
import { ProfileSchema } from "./form-wrapper";
import { WalletMultiButtonDynamic } from "../connect-wallet";
import { FormInput, FormNumberInput } from "@/components/ui/form-input";

import {
  Controller,
  get,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import * as z from "zod";
import slugify from "slugify";

import Link from "next/link";

import { Routes } from "@/config/routes";
import { getDonationLink } from "@/utils/links";
import { tokenList } from "@/config/tokens";
import { useWallet } from "@solana/wallet-adapter-react";
import { PlusIcon } from "lucide-react";

export function ProfileForm({
  loading,
  isEdit,
}: {
  loading: boolean;
  isEdit: boolean;
}): JSX.Element {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<z.infer<ProfileSchema>>();

  const { fields, append } = useFieldArray<z.infer<ProfileSchema>>({
    control,
    name: "amounts",
  });

  const wSlug = watch("slug");

  return (
    <Stack width="100%" gap={3}>
      <Card>
        <CardContent className="flex flex-col gap-5">
          <FormInput
            {...register("slug")}
            fullWidth
            placeholder=""
            label="Username"
            error={!!errors.slug}
            helperText={
              errors.slug?.message
                ? errors.slug?.message
                : wSlug
                  ? getDonationLink(slugify(wSlug))
                  : null
            }
          />

          <ConnectWalletButton isEdit={isEdit} />

          <FormInput
            {...register("name")}
            fullWidth
            placeholder=""
            label="Full name"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <FormInput
            {...register("bio")}
            fullWidth
            placeholder=""
            label="Bio"
            error={!!errors.bio}
            rows={5}
            multiline
            helperText={errors.bio?.message}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-5">
          <Stack alignItems="flex-start" gap={2}>
            <Stack
              width="100%"
              flexDirection="row"
              alignItems="flex-start"
              gap={4}
            >
              {fields.map((field, index) => (
                <Stack width="100%" key={field.id} flexDirection="row">
                  <Controller
                    control={control}
                    name={`amounts.${index}.value` as const}
                    render={({ field }) => (
                      <FormNumberInput
                        {...field}
                        fullWidth
                        placeholder="Enter amount"
                        allowNegative={false}
                        min={0}
                        label={`Amount ${index + 1}`}
                        error={!!get(errors, `amounts.${index}.value`)}
                        helperText={
                          get(errors, `amounts.${index}.value`)?.message ?? ""
                        }
                      />
                    )}
                  />
                </Stack>
              ))}
            </Stack>
            <Button
              disabled={fields.length === 3}
              onClick={() => append({ value: 1 })}
              startIcon={<PlusIcon />}
            >
              Add
            </Button>
          </Stack>

          <Controller
            name="acceptToken"
            control={control}
            render={({ field }) => (
              <FormTokenSelect
                {...field}
                options={tokenList}
                label="Token"
                id="token"
                fullWidth
                onChange={(_, data) => field.onChange(data)}
                error={!!errors.acceptToken}
                helperText={errors.acceptToken?.message as string | undefined}
              />
            )}
          />

          <FormInput
            {...register("thankMessage")}
            fullWidth
            placeholder=""
            label="Thank message"
            error={!!errors.thankMessage}
            rows={5}
            multiline
            helperText={errors.thankMessage?.message}
          />
        </CardContent>
        <CardActions className="justify-end gap-4"></CardActions>
      </Card>

      <Stack flexDirection="row" gap={2} justifyContent="flex-end">
        {isEdit && (
          <Link href={Routes.ADMIN} replace>
            <Button size="large" variant="outlined">
              Cancel
            </Button>
          </Link>
        )}

        <LoadingButton
          size="large"
          loading={loading}
          variant="contained"
          type="submit"
        >
          {isEdit ? "Update" : "Create"}
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

function ConnectWalletButton({ isEdit }: { isEdit: boolean }) {
  const theme = useTheme();
  const { publicKey } = useWallet();

  const {
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext<z.infer<ProfileSchema>>();

  const wWallet = watch("wallet");

  useEffect(() => {
    if (isEdit) {
      if (publicKey && wWallet !== publicKey?.toBase58()) {
        clearErrors("wallet");
        setValue("wallet", publicKey.toBase58());
      }
    } else {
      if (publicKey) {
        clearErrors("wallet");
        setValue("wallet", publicKey.toBase58());
      } else {
        setValue("wallet", "");
      }
    }
  }, [publicKey, isEdit, wWallet]);

  return (
    <FormControl>
      <FormLabel sx={{ mb: 1.5 }}>Wallet</FormLabel>
      {isEdit ? (
        <Stack flexDirection="row" gap={2} alignItems="center">
          <Stack
            border={`1px solid ${alpha(theme.palette.grey[500], 0.24)}`}
            height="56px"
            borderRadius={1}
            flex={1}
            justifyContent="center"
            padding="16.5px 14px"
            color="text.primary"
          >
            {wWallet}
          </Stack>
          <WalletMultiButtonDynamic
            style={{
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
              height: "56px",
              fontSize: "0.875rem",
              fontFamily: "inherit",
              backgroundColor: theme.palette.grey[800],
              color: theme.palette.common.white,
              borderRadius: theme.shape.borderRadius,
            }}
          />
        </Stack>
      ) : (
        <WalletMultiButtonDynamic
          style={{
            width: "100%",
            textAlign: "center",
            justifyContent: "center",
            height: "36px",
            fontSize: "0.875rem",
            fontFamily: "inherit",
            backgroundColor: theme.palette.grey[800],
            color: theme.palette.common.white,
            borderRadius: theme.shape.borderRadius,
          }}
        />
      )}
      {errors.wallet && (
        <FormHelperText error sx={{ mt: 1 }}>
          {errors.wallet.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}
