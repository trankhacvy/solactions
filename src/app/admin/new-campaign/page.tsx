import NewCampaignForm from "@/components/campaign/new-campaign-form";
import ProfileForm from "@/components/profile-form";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function NewCampaign() {
  const session = await getServerAuthSession();

  const user = await api.user.getById({ id: session?.user.id! });

  if (!user) {
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
        <Typography variant="h4">Create campaign</Typography>
      </Stack>
      <NewCampaignForm user={user} />
    </Stack>
  );
}
