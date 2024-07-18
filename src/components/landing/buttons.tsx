"use client";

import { Button } from "@mui/material";

import bs58 from "bs58";
import { getCsrfToken, signIn, useSession } from "next-auth/react";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Routes } from "@/config/routes";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SigninMessage } from "@/lib/signin-message";
import { ArrowRightIcon } from "lucide-react";

// export function AuthButton(): JSX.Element {
//   const { status } = useSession();
//   const wallet = useWallet();
//   const walletModal = useWalletModal();

//   const [openWalletModal, setOpenWalletModal] = useState(false);

//   const handleLogin = async () => {
//     signIn("twitter", {
//       callbackUrl: "/admin",
//     });

//     // try {
//     //   if (!wallet.connected) {
//     //     setOpenWalletModal(true);
//     //     walletModal.setVisible(true);
//     //     return;
//     //   }

//     //   const csrf = await getCsrfToken();
//     //   if (!wallet.publicKey || !csrf || !wallet.signMessage) return;

//     //   const message = new SigninMessage({
//     //     domain: window.location.host,
//     //     publicKey: wallet.publicKey?.toBase58(),
//     //     statement: `Sign this message to sign in to the app.`,
//     //     nonce: csrf,
//     //   });

//     //   const data = new TextEncoder().encode(message.prepare());
//     //   const signature = await wallet.signMessage(data);
//     //   const serializedSignature = bs58.encode(signature);

//     //   signIn("credentials", {
//     //     message: JSON.stringify(message),
//     //     signature: serializedSignature,
//     //     callbackUrl: Routes.ADMIN,
//     //   });
//     // } catch (error) {
//     //   console.error(error);
//     // }
//   };

//   useEffect(() => {
//     if (openWalletModal && wallet.connected) {
//       setOpenWalletModal(false);
//       handleLogin();
//     }
//   }, [openWalletModal, wallet.connected]);

//   return (
//     <>
//       {status !== "authenticated" && (
//         <Button onClick={handleLogin}>Get started</Button>
//       )}
//       {status === "authenticated" && (
//         <Link href={Routes.ADMIN}>
//           <Button>Dashboard</Button>
//         </Link>
//       )}
//     </>
//   );
// }

export function GetStarted(): JSX.Element {
  const { status } = useSession();

  return (
    <>
      {status !== "authenticated" && (
        <Link href={Routes.LOGIN}>
          <Button>Get started</Button>
        </Link>
      )}
      {status === "authenticated" && (
        <Link href={Routes.ADMIN}>
          <Button>Dashboard</Button>
        </Link>
      )}
    </>
  );
}

export function Cta({ title }: { title: string }): JSX.Element {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <Link href={Routes.ADMIN}>
        <Button size="large" endIcon={<ArrowRightIcon />}>
          {title}
        </Button>
      </Link>
    );
  }

  return (
    <Link href={Routes.LOGIN}>
      <Button size="large" endIcon={<ArrowRightIcon />}>
        {title}
      </Button>
    </Link>
  );
}
