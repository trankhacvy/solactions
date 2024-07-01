import { AppConfig } from "@/config/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Donations | ${AppConfig.title}`,
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
