"use client";

import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { KolStreamCard, Profile } from "../../components/admin/kol-stream-card";
import FormComponent from "../../components/admin/kol-form";
import { KolCalendar } from "../../components/admin/kol-calendar";
import { SelectDonationProfile } from "../../types";
import React from "react";

export default function KolStreamClient({ session, profile }: { session: unknown, profile: SelectDonationProfile }) {
  const [formValues, setFormValues] = useState<Profile | null>(null);

  const handleFormChange = (updatedFormValues: Profile) => {
    setFormValues(updatedFormValues);
  };

  return (
    <Stack width="100%" flexDirection={{ xs: "column", md: "row" }} flex={1}>
      <Stack
        flex={1}
        px={{ xs: 2, md: 3, lg: 5 }}
        py={{
          xs: 3,
          md: 5,
        }}
        gap={6}
      >
        <Box>
          <Typography mb={2} variant="h4">
            Call with KOL, {session?.user.name} 👋
          </Typography>
        </Box>
        <FormComponent onFormChange={handleFormChange} initialProfile={profile} />
        <KolCalendar />
      </Stack>
      <KolStreamCard profile={formValues ?? profile} />
    </Stack>
  );
}
