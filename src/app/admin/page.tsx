import { getServerAuthSession } from "@/server/auth";
import { PreviewCard } from "@/components/admin/preview-card";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Box, Stack, Typography } from "@mui/material";
import { YourLink } from "@/components/admin/your-link";
import { MoreActions } from "@/components/admin/more-actions";

export default async function AdminPage() {
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
            Hello, {session?.user.name} 👋
          </Typography>
          <YourLink profile={profile} />
        </Box>
        <MoreActions />
      </Stack>
      <PreviewCard profile={profile} />
    </Stack>
  );
}
