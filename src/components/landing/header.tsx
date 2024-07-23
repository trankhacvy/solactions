import { AppBar, Container, Link, Stack, Toolbar } from "@mui/material";

import React from "react";
import { Box } from "@mui/system";
import { Logo } from "../ui/logo";
import { HEADER } from "@/config/header";
import { GetStarted } from "./buttons";

const menuItems = ["How it work", "About us"];

export function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        boxShadow: "none",
        height: {
          xs: HEADER.H_MOBILE,
          lg: HEADER.H_DESKTOP,
        },
      }}
    >
      <Toolbar
        sx={{
          gap: 4.5,
          height: "100%",
        }}
        component={Container}
      >
        <Logo />
        <Stack
          display={{
            xs: "none",
            lg: "flex",
          }}
          flex={1}
          direction="row"
        >
          <Stack gap={6} direction="row">
            {menuItems.map((item) => (
              <Link
                color="text.secondary"
                fontWeight="fontWeightSemiBold"
                underline="hover"
                key={item}
              >
                {item}
              </Link>
            ))}
          </Stack>
        </Stack>
        <Box flex={1} />

        <GetStarted />
      </Toolbar>
    </AppBar>
  );
}
