require("@solana/wallet-adapter-react-ui/styles.css");
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import Providers from "./providers";
import { getServerAuthSession } from "@/server/auth";
import { AppConfig } from "@/config/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: AppConfig.title,
  description: AppConfig.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://solactions.fun/`)
    : new URL(`http://localhost:${process.env.PORT || 3000}`),
  openGraph: {
    images: [
      "https://ohgiavehhugheqqpoysy.supabase.co/storage/v1/object/public/3links/assets/og-image.jpg",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: AppConfig.title,
    description: AppConfig.description,
    creator: "@trankhac_vy",
    images: [
      {
        url: "https://ohgiavehhugheqqpoysy.supabase.co/storage/v1/object/public/3links/assets/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Providers session={session}>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
