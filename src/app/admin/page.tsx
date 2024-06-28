import { getServerAuthSession } from "@/server/auth";
import { PreviewCard } from "@/components/admin/preview-card";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Box, Stack, Typography } from "@mui/material";
import { YourLink } from "@/components/admin/your-link";
import { MoreActions } from "@/components/admin/more-actions";

export default async function AdminPage() {
  const session = await getServerAuthSession();

  const user = await api.user.getById({ id: session?.user.id! });

  if (!user) {
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
            Hello, {user.name} 👋
          </Typography>
          <YourLink user={user} />
        </Box>
        <MoreActions />
      </Stack>
      <PreviewCard user={user} />
    </Stack>
  );
}
