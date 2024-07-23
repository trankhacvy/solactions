"use client";

import bs58 from "bs58";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";

import React from "react";
import { AppBar, Button, Container, Link, Stack, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { SigninMessage } from "@/lib/signin-message";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Routes } from "@/config/routes";
import { HEADER } from "@/config/header";

const menuItems = ["How it work", "About us"];

export function Header(): JSX.Element {
  const { status } = useSession();
  const wallet = useWallet();
  const walletModal = useWalletModal();

  return (
    <AppBar
      position="sticky"
      sx={{
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
        <a className="inline-flex items-center gap-4" href="/">
          <img className="h-10 w-full" src="/logo.webp" />
          <span className="text-2xl font-extrabold">Blinks</span>
        </a>
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

        {(status !== "authenticated" || !!wallet.connected) && (
          <Button
            onClick={async () => {
              try {
                if (!wallet.connected) {
                  walletModal.setVisible(true);
                }

                const csrf = await getCsrfToken();
                if (!wallet.publicKey || !csrf || !wallet.signMessage) return;

                const message = new SigninMessage({
                  domain: window.location.host,
                  publicKey: wallet.publicKey?.toBase58(),
                  statement: `Sign this message to sign in to the app.`,
                  nonce: csrf,
                });

                const data = new TextEncoder().encode(message.prepare());
                const signature = await wallet.signMessage(data);
                const serializedSignature = bs58.encode(signature);

                signIn("credentials", {
                  message: JSON.stringify(message),
                  signature: serializedSignature,
                });
              } catch (error) {
                console.error(error);
              }
            }}
            variant="outlined"
          >
            Login
          </Button>
        )}

        {status === "authenticated" && wallet.connected && (
          <Link href={Routes.NEW}>
            <Button>Create profile</Button>
          </Link>
        )}

        {status === "authenticated" && wallet.connected && (
          <Button
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
