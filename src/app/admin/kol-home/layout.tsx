import { AppConfig } from "@/config/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `KOL Home | ${AppConfig.title}`,
};

export default async function KolHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return <>{children}</>;
}