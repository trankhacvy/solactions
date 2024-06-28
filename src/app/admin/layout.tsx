import DashboardLayout from "@/components/layout/dashboard";
import { Routes } from "@/config/routes";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

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
