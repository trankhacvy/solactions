"use client";

import { Button } from "@mui/material";

import { useSession } from "next-auth/react";

import React from "react";
import Link from "next/link";
import { Routes } from "@/config/routes";
import { ArrowRightIcon } from "lucide-react";

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
