import { Routes } from "@/config/routes";
import { Button, Stack, Typography, Card, CardContent, CardActions } from "@mui/material";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function DispenserPage() {
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
      <Typography variant="h4" mb={5}>Dispenser</Typography>
      <Stack direction="row" spacing={3}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              NFT Dispenser
            </Typography>
            <Typography variant="body2">
              Create and manage NFT Dispenser
            </Typography>
          </CardContent>
          <CardActions>
            <Link href={Routes.ADMIN_NFT_DISPENSER}>
              <Button size="small">Manage</Button>
            </Link>
            <Link href={Routes.ADMIN_NEW_NFT_DISPENSER}>
              <Button size="small" startIcon={<PlusIcon />}>Create</Button>
            </Link>
          </CardActions>
        </Card>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              cNFT Dispenser
            </Typography>
            <Typography variant="body2">
              Create and manage cNFT Dispenser
            </Typography>
          </CardContent>
          <CardActions>
            <Link href={Routes.ADMIN_C_NFT_DISPENSER}>
              <Button size="small">Manage</Button>
            </Link>
            <Link href={Routes.ADMIN_NEW_C_NFT_DISPENSER}>
              <Button size="small" startIcon={<PlusIcon />}>Create</Button>
            </Link>
          </CardActions>
        </Card>
      </Stack>
    </Stack>
  );
}
