import { useEffect } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { alpha, useTheme } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";

import { usePathname } from "next/navigation";
import { NAV } from "@/config/header";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import {
  HeartHandshakeIcon,
  HomeIcon,
  Link2Icon,
  TicketPercent
} from "lucide-react";
import { Routes } from "@/config/routes";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export default function Nav({
  openNav,
  onCloseNav,
}: {
  openNav: boolean;
  onCloseNav: VoidFunction;
}) {
  const pathname = usePathname();

  const theme = useTheme();

  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Box
      sx={{
        height: 1,
      }}
    >
      <Box pl="28px" pr={2} pt={2} pb={5}>
        <Logo />
      </Box>

      {renderMenu}
      <Stack
        width="100%"
        alignItems="center"
        justifyContent="center"
        mt={5}
        sx={{ px: 2 }}
      >
        <Button onClick={() => signOut()}>Logout</Button>
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {lgUp ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

function NavItem({
  item,
}: {
  item: { title: string; path: string; icon: React.ReactNode };
}) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={Link}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: "body2",
        color: "text.secondary",
        textTransform: "capitalize",
        fontWeight: "fontWeightMedium",
        ...(active && {
          color: "primary.main",
          fontWeight: "fontWeightSemiBold",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

const navConfig = [
  {
    title: "Home",
    path: Routes.ADMIN,
    icon: <HomeIcon />,
  },
  {
    title: "Donations",
    path: Routes.ADMIN_DONATIONS,
    icon: <HeartHandshakeIcon />,
  },
  {
    title: "Tiplinks",
    path: Routes.ADMIN_TIPLINKS,
    icon: <Link2Icon />,
  },
  {
    title: "KOL Stream",
    path: Routes.ADMIN_KOL_STREAM,
    icon: <HeartHandshakeIcon />,
  },
  // {
  //   title: "Settings",
  //   path: Routes.ADMIN_SETTINGS,
  //   icon: <SettingsIcon />,
  // },
  // {
  //   title: "NFT Dispenser",
  //   path: Routes.ADMIN_NFT_DISPENSER,
  //   icon: <ImageIcon />,
  // },
  // {
  //   title: "cNFT Dispenser",
  //   path: Routes.ADMIN_C_NFT_DISPENSER,
  //   icon: <BookIcon />,
  // },
  {
    title: "Dispenser",
    path: Routes.ADMIN_DISPENSER,
    icon: <TicketPercent />,
  }
];
