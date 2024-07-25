import React from "react";
import { AppConfig } from "../../../config/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `KOL Stream | ${AppConfig.title}`,
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}