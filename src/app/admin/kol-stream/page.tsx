import { getServerAuthSession } from "../../../server/auth";
import { api } from "../../../trpc/server";
import { notFound } from "next/navigation";
import KolStreamClient from "../../../components/admin/kol-stream-client";
import React from "react";

export default async function KolStream() {
  const session = await getServerAuthSession();

  const profile = await api.donation.me();

  if (!profile || !session) {
    return notFound();
  }

  return <KolStreamClient session={session} profile={profile} />;
}