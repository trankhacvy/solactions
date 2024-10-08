import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Routes } from "@/config/routes";
import { Box, Stack, Typography } from "@mui/material";
import { YourLinkKol } from "@/components/admin/your-link-kol";
import { MeetingsTable } from "@/components/admin/more-meetings";
// import { PreviewKolCard } from "@/components/admin/preview-kol-card";

export default async function AdminPage() {
  const session = await getServerAuthSession();
  const profile = await api.talkwithme.me();
  
  if (!profile) {
    redirect(Routes.ADMIN_KOL_STREAM);
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
            Call with me, {session?.user.name} 👋
          </Typography>
          <YourLinkKol profile={profile}/>
        </Box>
        <MeetingsTable profile={profile}/>
      </Stack>
    </Stack>
  );
}