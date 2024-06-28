"use client";

import { api } from "@/trpc/react";
import { UserCard } from "./user-card";

export function UserGrid() {
  const { data: users, isLoading } = api.user.all.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) return "loading...";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
