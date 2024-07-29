import { AppBar, Toolbar } from "@mui/material";

import React from "react";
import { Box } from "@mui/system";
import { Logo } from "../ui/logo";
import { HEADER } from "@/config/header";
import ConnectWalletButton from "../connect-wallet";

export function Header(): JSX.Element {
  return (
    <AppBar
      sx={{
        position: {
          xs: "fixed",
          lg: "fixed",
        },
        boxShadow: "none",
        height: {
          xs: HEADER.H_MOBILE,
          lg: HEADER.H_DESKTOP_OFFSET,
        },
        bgcolor: "transparent",
      }}
    >
      <Toolbar
        sx={{
          gap: 4.5,
          height: "100%",
          color: "text.primary",
        }}
      >
        <Logo />
        <Box flex={1} />
        <ConnectWalletButton />
      </Toolbar>
    </AppBar>
  );
}
