import ProfileLayout from "@/components/profile/profile-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProfileLayout>{children}</ProfileLayout>;
}
