"use client";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

import { Box, OutlinedInput, Stack, useTheme } from "@mui/material";
import React from "react";

export interface Profile {
  title: string;
  duration: string;
  customDuration?: string;
  price: string;
  type: string;
  calendyUrl?: string;
  telegramUsername?: string;
  description: string;
  image: string; // Add image field
}

export const KolStreamCard = ({ profile }: { profile: Profile }) => {
  const theme = useTheme();

  return (
    <Box
      p={{ xs: 3, md: 5 }}
      bgcolor={theme.palette.background.default}
      height="100%"
    >
      <Card sx={{ maxWidth: 360, mx: "auto" }}>
        <CardMedia
          component="img"
          height="140"
          image={profile.image}
          alt={profile.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {profile.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Duration: {profile.duration === 'custom' ? profile.customDuration : profile.duration}
          </Typography>
          {profile.customDuration && (
            <Typography variant="body2" color="text.secondary">
              Custom Duration: {profile.customDuration}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Price: {profile.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Type: {profile.type}
          </Typography>
          {profile.calendyUrl && (
            <Typography variant="body2" color="text.secondary">
              Calendy URL: {profile.calendyUrl}
            </Typography>
          )}
          {profile.telegramUsername && (
            <Typography variant="body2" color="text.secondary">
              Telegram Username: {profile.telegramUsername}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Description: {profile.description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{ display: "flex", flexDirection: "column", p: 2, pt: 0, gap: 2 }}
        >
          <Stack width="100%">
            <OutlinedInput
              sx={{ width: "100%" }}
              placeholder="Enter your email"
              endAdornment={
                <Button
                  sx={{
                    px: 3,
                    whiteSpace: "nowrap",
                    ml: 1,
                  }}
                  color="inherit"
                >
                  Pay
                </Button>
              }
            />
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
};