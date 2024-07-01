import { DonationTable } from "@/components/admin/donation-table";
import ProfileForm from "@/components/profile-form";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default function Donations() {
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
        <Typography variant="h4">Donations</Typography>
      </Stack>
      <DonationTable />
    </Stack>
  );
}
