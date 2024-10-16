"use client";

import React, { useEffect } from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";

import LoadingButton from "@mui/lab/LoadingButton";

import { FormTokenSelect } from "@/components/ui/form-token-select";
import { ProfileSchema } from "./form-wrapper";
import { FormInput, FormNumberInput } from "@/components/ui/form-input";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";

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
  const selectedType = watch('type');
  return (
    <Stack width="100%" gap={3}>
      <Card>
        <CardContent className="flex flex-col gap-5">
          <FormInput
            {...register("slug")}
            fullWidth
            placeholder=""
            label="Custom Name"
            error={!!errors.slug}
            helperText={
              errors.slug?.message
                ? errors.slug?.message
                : wSlug
                  ? getDonationLink(slugify(wSlug))
                  : null
            }
          />


          <FormInput
            {...register("title")}
            fullWidth
            placeholder=""
            label="Title"
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <FormInput
            {...register("description")}
            fullWidth
            placeholder=""
            label="Description"
            error={!!errors.description}
            rows={5}
            multiline
            helperText={errors.description?.message}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-5">
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

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
              <RadioGroup {...field} row>
                  <FormControlLabel value="TELEGRAM" control={<Radio />} label="Telegram" />
                  <FormControlLabel value="CALENDLY" control={<Radio />} label="Calendy" />
              </RadioGroup>
          )}
        />
         {selectedType === 'TELEGRAM' && (
             <FormInput
              {...register("telegram_username")}
              fullWidth
              placeholder=""
              label="Telegram Username"
           />
        )}

        {selectedType === 'CALENDLY' && (
            <FormInput
              {...register("calendyUrl")}
              fullWidth
              placeholder=""
              label="Calendy Url"
            />
          )}
          <FormInput
                {...register("price")}
                fullWidth
                placeholder=""
                label="Price"
                error={!!errors.title}
                helperText={errors.title?.message}
            />
             <FormInput
              {...register("duration")}
              fullWidth
              placeholder=""
              label="Duration"
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

