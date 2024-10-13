"use client";
import { Box, Stack, Typography } from "@mui/material";
import { ProfileFormWrapper } from "../../components/profileKol/form-wrapper"
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
        <ProfileFormWrapper/>
      </Stack>
    </Stack>
  );
}