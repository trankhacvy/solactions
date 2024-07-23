import ProfileLayout from "@/components/profile/profile-layout";
import { AppConfig } from "@/config/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Donation profile | ${AppConfig.title}`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProfileLayout>{children}</ProfileLayout>;
}
