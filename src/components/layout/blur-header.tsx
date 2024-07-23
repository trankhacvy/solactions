"use client";

import React from "react";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { Logo } from "../ui/logo";
import { HEADER } from "@/config/header";
import ConnectWalletButton from "../connect-wallet";

export default function BlurHeader({
  showConnectWallet,
}: {
  showConnectWallet?: boolean;
}): JSX.Element {
  return (
    <AppBar
      sx={{
        position: {
          xs: "sticky",
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
        {showConnectWallet && <ConnectWalletButton />}
      </Toolbar>
    </AppBar>
  );
}
