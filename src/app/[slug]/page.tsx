import { ProfileCard } from "@/components/profile/profile-card";
import { api } from "@/trpc/server";
import { Container, Stack } from "@mui/material";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Profile({ params: { slug } }: Props) {
  const user = await api.user.getBySlug({ slug });

  if (!user) {
    notFound();
  }

  return (
    <Stack>
      {/* <div className="h-[1000px]" /> */}
      <ProfileCard user={user} />
    </Stack>
  );
}
