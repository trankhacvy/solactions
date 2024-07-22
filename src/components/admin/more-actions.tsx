"use client";

import { Routes } from "@/config/routes";
import {
  Badge,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

const options = [
  {
    title: "Tip link",
    subtitle: "Send money directly to others on Twitter",
    href: Routes.ADMIN_NEW_TIPLINKS,
    disabled: false,
  },
  { title: "NFT Sale Link", subtitle: "Sell NFTs on Twitter.", enable: false },
  {
    title: "Payment Link",
    subtitle: "Sell your products on Twitter",
  },
  {
    title: "Vote Link",
    subtitle: "Create a poll on Twitter, with the winner receiving the prize",
  },
];

export function MoreActions() {
  return (
    <Box>
      <Typography mb={2} variant="h6">
        More actions
      </Typography>
      <Grid container spacing={3}>
        {options.map((option) => (
          <Grid key={option.title} item xs={12} md={6} xl={4}>
            <ActionOption {...option} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function ActionOption({
  title,
  subtitle,
  disabled = true,
  href,
}: {
  title: string;
  subtitle: string;
  disabled?: boolean;
  href?: string;
}) {
  const router = useRouter();
  return (
    <Card>
      <CardActionArea
        onClick={() => {
          href && router.push(href);
        }}
        disabled={disabled}
      >
        <CardContent component={Stack} gap={1}>
          <Stack flexDirection="row" gap={1}>
            <Typography fontWeight="fontWeightSemiBold">{title}</Typography>
            <Chip label="Soon" color="info" size="small" />
          </Stack>
          <Typography color="text.secondary">{subtitle}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
