import React from "react";
import { Button, Stack, Box, Container, Typography } from "@mui/material";
import { Cta } from "./buttons";

export function Hero() {
  return (
    <Box
      id="hero"
      sx={{
        backgroundColor: "background.paper",
        py: 17,
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box textAlign="center">
          <Typography
            maxWidth={{
              xs: "360px",
              md: "unset",
            }}
            mx="auto"
            variant="h1"
          >
            No-Code Actions on Solana
          </Typography>
          <Typography
            maxWidth={580}
            color="text.secondary"
            component="p"
            variant="h6"
            fontWeight="fontWeightRegular"
            mt={2}
            mx="auto"
          >
            Create actions in just a few clicks. Share directly to Twitter.
          </Typography>
        </Box>

        <Stack mt={4} direction="row" gap={2}>
          <Cta title="Try for free" />
        </Stack>

        <Stack
          mt={{
            xs: 10,
            lg: 17,
          }}
          width="100%"
          height={{
            xs: 316,
            md: 360,
            lg: 650,
          }}
          px={{ xs: 3 }}
          justifyContent="center"
          borderRadius={5}
          sx={{
            backgroundImage: "url(/hero-bg.svg)",
            backgroundSize: "80px 80px",
            backgroundPosition: "1px",
            backgroundColor: "rgb(12 12 12)",
          }}
        >
          <Box
            component="img"
            src="/banner.png"
            alt="logo"
            sx={{
              height: { xs: 268, md: 312, lg: 602 },
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
