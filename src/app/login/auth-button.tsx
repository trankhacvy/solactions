"use client";

import { Button } from "@mui/material";

import { signIn } from "next-auth/react";

import React from "react";
import { Routes } from "@/config/routes";
import { Twitter } from "lucide-react";

export function AuthButton(): JSX.Element {
  const handleLogin = async () => {
    signIn("twitter", {
      callbackUrl: Routes.ADMIN,
    });
  };

  return (
    <Button onClick={handleLogin} fullWidth size="large" endIcon={<Twitter />}>
      Login with
    </Button>
  );
}
