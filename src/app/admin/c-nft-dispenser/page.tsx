import { CNFTDispenserTable } from "@/components/c-nft-dispenser/c-nft-dispenser-table";
import { Routes } from "@/config/routes";
import { Button, Stack, Typography } from "@mui/material";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function CNFTDispenserPage() {
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
        <Typography variant="h4">cNFT Dispenser</Typography>
        <Link href={Routes.ADMIN_NEW_C_NFT_DISPENSER}>
          <Button startIcon={<PlusIcon />}>New dispenser</Button>
        </Link>
      </Stack>
      <CNFTDispenserTable />
    </Stack>
  );
}
