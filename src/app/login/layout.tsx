import BlurHeader from "@/components/layout/blur-header";
import Footer from "@/components/layout/footer";
import { AppConfig } from "@/config/constants";
import { HEADER } from "@/config/header";
import { Stack } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Login | ${AppConfig.title}`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      flex={1}
      minHeight="100%"
      sx={{
        position: "relative",
        "&:before": {
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          content: '""',
          width: "100%",
          height: "100%",
          opacity: 0.24,
          backgroundImage: `url(/blur-background.webp)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      <BlurHeader />
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
      <Footer />
    </Stack>
  );
}
