import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { alpha, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MenuIcon } from "lucide-react";
import { HEADER, NAV } from "@/config/header";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

// import { useResponsive } from "src/hooks/use-responsive";

// import { bgBlur } from "src/theme/css";

// import Iconify from "src/components/iconify";

// import Searchbar from "./common/searchbar";
// import { NAV, HEADER } from "./config-layout";
// import AccountPopover from "./common/account-popover";
// import LanguagePopover from "./common/language-popover";
// import NotificationsPopover from "./common/notifications-popover";

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }: { onOpenNav: VoidFunction }) {
  const theme = useTheme();

  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton aria-label="Menu" onClick={onOpenNav} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
      )}
      {/* <Searchbar /> */}
      searchbar
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" alignItems="center" spacing={1}>
        {/* <LanguagePopover />
        <NotificationsPopover />
        <AccountPopover /> */}
        <Button onClick={() => signOut()}>Logout</Button>
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: "none",
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: "blur(6px)",
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
