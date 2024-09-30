import { ProfileCard } from "@/components/profile/profile-card";
import { env } from "@/env";
import { AppConfig } from "@/config/constants";
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
    title: `${profile.name} | ${AppConfig.title}`,
    description: profile.bio,
    twitter: {
      card: "player",
      players: [
        {
          playerUrl: `${env.NEXT_PUBLIC_FE_BASE_URL}/${slug}`,
          streamUrl: `${env.NEXT_PUBLIC_FE_BASE_URL}/${slug}`,
          width: 360,
          height: 480,
        },
      ],
      images: []
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
