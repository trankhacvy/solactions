import React from "react";
import { Button, Stack, Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

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
          <Button
            LinkComponent={Link}
            href="http://app.localhost:3000"
            endIcon={<ArrowRightIcon />}
            size="large"
          >
            Try for free
          </Button>
        </Stack>

        <Box
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
          bgcolor="primary.main"
          borderRadius={5}
        />
      </Container>
    </Box>
  );
}
