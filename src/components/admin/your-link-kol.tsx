"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

import { SelectKolProfileSchema } from "@/types";
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
import { getDonationLink , getTalkwithmeLink} from "@/utils/links";
import { twitterLink } from "@/utils/twitter";

export function YourLinkKol({ profile }: { profile: SelectKolProfileSchema }) {
  const theme = useTheme();

  const [copying, setCopying] = useState(false);
  const [_, copy] = useCopyToClipboard();

  const handleCopyLink = async () => {
    setCopying(true);
    await copy(getTalkwithmeLink(profile.slug));
    setTimeout(() => {
      setCopying(false);
    }, 1500);
  };

  return (
    <Card sx={{ maxWidth: 480, mx: "auto" }}>
      <CardHeader title="Your booking link" />
      <CardContent>
        <Chip
          color="primary"
          label={
            <Stack flexDirection="row" alignItems="center" gap={2}>
              <MLink sx={{ color: "white" }} underline="none">
                {getTalkwithmeLink(profile.slug)}
              </MLink>
              <IconButton
                sx={{ color: "white" }}
                size="small"
                aria-label="Copy"
                onClick={handleCopyLink}
              >
                {copying ? <CheckIcon /> : <CopyIcon />}
              </IconButton>
              
            </Stack>
          }
          size="medium"
          sx={{ width: "100%", fontSize: theme.typography.h6, py: 3 }}
        />
        
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", gap: 22}}>
        <IconButton
          sx={{ color: "primary.main" }}
          aria-label="Copy Link"
          onClick={handleCopyLink}
        >
          {copying ? <CheckIcon /> : <CopyIcon />}
        </IconButton>
        <Stack spacing={2} direction="row">
          <Link href={Routes.ADMIN_KOL_STREAM}>
            <Button variant="outlined">Edit</Button>
          </Link>
          
          <a
            href={twitterLink(getTalkwithmeLink(profile.slug), {
              title: "Meeting with me on ",
              hashtags: ["solactions", "actions", "blinks", "opos"],
            })}
            target="_blank"
            rel="noopener"
          >
            <Button endIcon={<TwitterIcon />}>Share on</Button>
          </a>
        </Stack>
      </CardActions>
    </Card>
  );
}