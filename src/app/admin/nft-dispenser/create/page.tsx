import { Stack, Typography } from "@mui/material";
import NewDispenserForm from "@/components/nft-dispenser/nft-dispenser-form";
import { getServerAuthSession } from "@/server/auth";
import { notFound } from "next/navigation";

export default async function NewNFTDispenser() {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
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
        <Typography variant="h4">Create Dispenser</Typography>
      </Stack>
      <NewDispenserForm user={session.user} />
    </Stack>
  );
}
