"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { ArrowRightIcon } from "lucide-react";

export function Features(): JSX.Element {
  return (
    <Box
      id="features"
      sx={{
        py: 17,
      }}
    >
      <Container sx={{ textAlign: "center" }}>
        <Box maxWidth="600px" mx="auto">
          <Typography variant="h2" mb={2.5}>
            Let your fans interact with you directly on Twitter
          </Typography>
          <Typography
            maxWidth="390px"
            mx="auto"
            color="text.secondary"
            variant="h6"
            fontWeight="normal"
          >
            Allow your fans to donate, tip, vote, or buy NFTs directly on
            Twitter.
          </Typography>
        </Box>

        <Grid container py={8} spacing={3}>
          <Grid item xs={12} lg={4}>
            <FeatureItem
              icon="/no-code.png"
              title="No Code"
              description="All you need is an internet connection. We'll take care of the rest."
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <FeatureItem
              icon="/analytic.png"
              title="Multiple actions"
              description="Create donation, tip, poll, and buy NFT actions in just few clicks."
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <FeatureItem
              icon="/saving.png"
              title="Analytics"
              description="Record all on-chain interactions. Know your most valuable supporters."
            />
          </Grid>
        </Grid>

        <Button endIcon={<ArrowRightIcon />} size="large" variant="contained">
          Create your first action
        </Button>
      </Container>
    </Box>
  );
}

type FeatureItemProps = {
  icon: string;
  title: string;
  description: string;
};

function FeatureItem({
  icon,
  title,
  description,
}: FeatureItemProps): JSX.Element {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          src={icon}
          sx={{ objectFit: "cover", mb: 4, height: 240, width: "auto" }}
        />
        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
        <Typography color="text.secondary" variant="body1" component="p">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
