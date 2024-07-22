import { Stack, Typography } from "@mui/material";

export default async function NewCampaign() {
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
      {/* <NewCampaignForm user={user} /> */}
    </Stack>
  );
}
