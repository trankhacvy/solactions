"use client";

import React from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";

import { Controller, useFormContext } from "react-hook-form";
import * as z from "zod";
import { ProfileSchema } from "./form-wrapper";
import { AvatarUploader } from "../ui/avatar-uploader";

export function ProfilePreview(): JSX.Element {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<z.infer<ProfileSchema>>();

  const name = watch("name");
  const bio = watch("bio");
  const amounts = watch("amounts");
  const acceptToken = watch("acceptToken");

  return (
    <Card sx={{ maxWidth: 420, width: "100%" }}>
      <FormControl error={!!errors.image} sx={{ p: 2 }} fullWidth>
        <Controller
          control={control}
          name="image"
          render={({ field }) => {
            return (
              <AvatarUploader
                value={field.value}
                onChange={(file) => {
                  field.onChange(file);
                }}
              />
            );
          }}
        />
        <FormHelperText sx={{ mt: 1 }}>
          {errors.image?.message as string}
        </FormHelperText>
      </FormControl>

      <CardContent
        sx={{
          px: 2,
          pb: 2,
          pt: 0,
        }}
      >
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {bio}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", flexDirection: "column", p: 2, pt: 0, gap: 2 }}
      >
        <Stack flexDirection="row" gap={2} alignItems="center" width="100%">
          {amounts.map((amount, idx) => (
            <Button key={idx} sx={{ flex: 1 }} color="inherit">
              {amount.value} {acceptToken?.symbol}
            </Button>
          ))}
        </Stack>
        <Stack width="100%">
          <OutlinedInput
            sx={{ width: "100%" }}
            placeholder="Enter a custom amount"
            endAdornment={
              <Button
                sx={{
                  px: 3,
                  whiteSpace: "nowrap",
                  ml: 1,
                }}
                color="inherit"
              >
                Donate
              </Button>
            }
          />
        </Stack>
      </CardActions>
    </Card>
  );
}
