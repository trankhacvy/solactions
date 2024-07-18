import { ProfileFormWrapper } from "@/components/onboarding/form-wrapper";
import { api } from "@/trpc/server";
import { Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function NewProfile() {
  const profile = await api.donation.me();

  if (!profile) {
    return notFound();
  }

  return (
    <Stack
      width="100%"
      flex={1}
      px={{ xs: 2, md: 3, lg: 5 }}
      py={{
        xs: 3,
        md: 5,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Edit profile</Typography>
      </Stack>
      <ProfileFormWrapper profile={profile} />
    </Stack>
  );
}
