"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

import { SelectDonationProfile } from "@/types";
import {
  CardHeader,
  Chip,
  IconButton,
  Link as MLink,
  Stack,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { Routes } from "@/config/routes";
import { CheckIcon, CopyIcon, TwitterIcon } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";
import { useState } from "react";
import { getDonationLink } from "@/utils/links";
import { twitterLink } from "@/utils/twitter";

export function YourLink({ profile }: { profile: SelectDonationProfile }) {
  const theme = useTheme();

  const [copying, setCopying] = useState(false);
  const [_, copy] = useCopyToClipboard();

  return (
    <Card sx={{ maxWidth: 480, mx: "auto" }}>
      <CardHeader title="Your donation action" />
      <CardContent>
        <Chip
          color="primary"
          label={
            <Stack flexDirection="row" alignItems="center" gap={2}>
              <MLink sx={{ color: "white" }} underline="none">
                {getDonationLink(profile.slug)}
              </MLink>
              <IconButton
                sx={{ color: "white" }}
                size="small"
                aria-label="Copy"
                onClick={async () => {
                  setCopying(true);
                  copy(getDonationLink(profile.slug));
                  setTimeout(() => {
                    setCopying(false);
                  }, 1500);
                }}
              >
                {copying ? <CheckIcon /> : <CopyIcon />}
              </IconButton>
            </Stack>
          }
          size="medium"
          sx={{ width: "100%", fontSize: theme.typography.h5, py: 4 }}
        />
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Link href={Routes.ADMIN_EDIT}>
          <Button variant="outlined">Edit</Button>
        </Link>
        <a
          href={twitterLink(getDonationLink(profile.slug), {
            title: "Donate me on ",
            hashtags: ["solactions", "actions", "blinks", "opos"],
          })}
          target="_blank"
          rel="noopener"
        >
          <Button endIcon={<TwitterIcon />}>Share on</Button>
        </a>
      </CardActions>
    </Card>
  );
}
