import React from "react";
import {
  Box,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Logo } from "../ui/logo";

export function Footer(): JSX.Element {
  return (
    <Box component="footer" bgcolor="background.paper">
      <Container sx={{ pt: 10, pb: 4 }}>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Logo />
          <Stack
            flexDirection="row"
            display={{
              xs: "none",
              md: "flex",
            }}
            gap={5}
          >
            <Link
              color="text.secondary"
              fontWeight="fontWeightSemiBold"
              underline="hover"
            >
              How it work
            </Link>
            <Link
              color="text.secondary"
              fontWeight="fontWeightSemiBold"
              underline="hover"
            >
              About us
            </Link>
          </Stack>
        </Stack>
        <Divider sx={{ my: 4 }} />
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            flexDirection={{
              xs: "column",
              md: "row",
            }}
            gap={4}
          >
            <Typography variant="caption" color="text.secondary">
              Copyright © 2024 CandyBox. All rights reserved
            </Typography>
            <Link
              color="text.secondary"
              fontWeight="fontWeightSemiBold"
              underline="hover"
            >
              Privacy Policy
            </Link>
            <Link
              color="text.secondary"
              fontWeight="fontWeightSemiBold"
              underline="hover"
            >
              Team of Use
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
