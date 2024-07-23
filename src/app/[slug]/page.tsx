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

  const profile = await api.donation.getBySlug({ slug });

  if (!profile) {
    notFound();
  }

  return {
    title: `${profile.name} | SolActions`,
    description: profile.bio,
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function Profile({ params: { slug } }: Props) {
  const profile = await api.donation.getBySlug({ slug });

  if (!profile) {
    notFound();
  }

  return (
    <Stack>
      <ProfileCard profile={profile} />
    </Stack>
  );
}
