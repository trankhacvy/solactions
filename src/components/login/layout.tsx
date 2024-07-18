import { Stack } from "@mui/material";
// import { Header } from "./header";
import { HEADER } from "@/config/header";
// import { Footer } from "./footer";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack flex={1} minHeight="100%" bgcolor="grey.200">
      {/* <Header /> */}
      <Stack
        px={{
          xs: 2,
          lg: 0,
        }}
        py={{
          xs: 5,
          lg: `calc(${HEADER.H_DESKTOP_OFFSET}px + 24px)`,
        }}
        flex={1}
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </Stack>
      {/* <Footer /> */}
    </Stack>
  );
}
