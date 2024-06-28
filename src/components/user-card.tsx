import { Box } from "@mui/material";

export function UserCard({ user }: { user: any }) {
  return <Box>{user.name}</Box>;
}
