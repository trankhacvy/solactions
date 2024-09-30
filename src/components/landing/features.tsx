"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Cta } from "./buttons";

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
              icon="/donation-action.avif"
              title="No Code"
              description="All you need is an internet connection. We'll take care of the rest."
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <FeatureItem
              icon={[
                "/donation-action.avif",
                "/sale-action.avif",
                "/vote-action.avif",
              ]}
              title="Multiple actions"
              description="Create donation, tip, poll, and buy NFT actions in just few clicks."
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <FeatureItem
              icon="/analytic.avif"
              title="Analytics"
              description="Record all on-chain interactions. Know your most valuable supporters."
            />
          </Grid>
        </Grid>

        <Cta title="Create your first action" />
      </Container>
    </Box>
  );
}

type FeatureItemProps = {
  icon: string | string[];
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
        {typeof icon === "string" ? (
          <Box
            component="img"
            src={icon}
            sx={{ objectFit: "cover", mb: 4, height: 240, width: "auto" }}
          />
        ) : (
          <Box
            sx={{
              mb: 4,
              width: "100%",
              height: 240,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {icon.map((i, idx) => (
              <Box
                key={idx}
                component="img"
                src={i}
                sx={{
                  position: "absolute",
                  inset: 0,
                  left: "50%",
                  objectFit: "cover",
                  height: 240,
                  width: "auto",
                  transform: `translateX(-${25 * (idx + 1)}%) rotate(${(idx - 1) * -20}deg)`,
                  transformOrigin: "bottom center",
                  zIndex: idx === 1 ? 999 : 1,
                }}
              />
            ))}
          </Box>
        )}
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
