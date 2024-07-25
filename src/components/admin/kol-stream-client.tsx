"use client";

import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { KolStreamCard, type Profile } from "../../components/admin/kol-stream-card";
import FormComponent from "../../components/admin/kol-form";
import { KolCalendar } from "../../components/admin/kol-calendar";
import { type SelectDonationProfile } from "../../types";
import React from "react";
import { type Session } from "next-auth";

interface KolStreamClientProps {
  session: Session & {
    user: {
      name: string | null | undefined;
    }
  };
  profile: SelectDonationProfile;
}

export default function KolStreamClient({ session, profile }: KolStreamClientProps) {
  const [formValues, setFormValues] = useState<Profile | null>(null);

  const handleFormChange = (updatedFormValues: Profile) => {
    setFormValues(updatedFormValues);
  };

  // Convert SelectDonationProfile to Profile
  const initialProfile: Profile = {
    title: "",
    duration: "",
    price: "",
    type: "",
    description: "",
    customDuration: "",
    calendyUrl: "",
    telegramUsername: "",
    image: profile.image ?? "",
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
          Call with KOL, {session?.user?.name ?? 'Guest'} 👋
        </Typography>
        </Box>
        <FormComponent onFormChange={handleFormChange} initialProfile={initialProfile} />
        <KolCalendar />
      </Stack>
      <KolStreamCard profile={formValues ?? initialProfile} />
    </Stack>
  );
}