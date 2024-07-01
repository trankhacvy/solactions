import DashboardLayout from "@/components/layout/dashboard";
import { AppConfig } from "@/config/constants";
import { Routes } from "@/config/routes";
import { getServerAuthSession } from "@/server/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `Admin | ${AppConfig.title}`,
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(Routes.HOME);
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
