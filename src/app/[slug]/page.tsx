import { ProfileCard } from "@/components/profile/profile-card";
import { api } from "@/trpc/server";
import { Stack } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const user = await api.user.getBySlug({ slug });

  if (!user) {
    notFound();
  }

  return {
    title: `${user.name} | SolActions`,
    description: user.bio,
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function Profile({ params: { slug } }: Props) {
  const user = await api.user.getBySlug({ slug });

  if (!user) {
    notFound();
  }

  return (
    <Stack>
      <ProfileCard user={user} />
    </Stack>
  );
}
