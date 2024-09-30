"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

// mui
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "@/config/theme";

import * as dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";

import { env } from "@/env";
import { SnackbarHost } from "@/components/ui/snackbar";

dayjs.extend(isToday);
dayjs.extend(relativeTime);

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <ConnectionProvider endpoint={env.NEXT_PUBLIC_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SessionProvider session={session}>
            <ThemeProvider>
              {children}
              <SnackbarHost />
            </ThemeProvider>
          </SessionProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

const extendedTheme = createTheme(theme);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <AppRouterCacheProvider>
      <MuiThemeProvider theme={extendedTheme}>
        <CssBaseline />
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
        {children}
        {/* </LocalizationProvider> */}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
