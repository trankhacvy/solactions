import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Box, Stack, Typography } from "@mui/material";
import { KolStreamCard } from "@/components/admin/kol-stream-card";
import { KolLink } from "@/components/admin/kol-link";
import FormComponent from "@/components/admin/kol-form";
import { KolCalendar } from "@/components/admin/kol-calendar";

export default async function KolStream() {
  const session = await getServerAuthSession();

  const profile = await api.donation.me();

  if (!profile) {
    return notFound();
  }

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
          <KolLink profile={profile} />
        </Box>
        <FormComponent/>
        <KolCalendar />
      </Stack>
      <KolStreamCard profile={profile} />
    </Stack>
  );
}