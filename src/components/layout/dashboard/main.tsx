import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import { SxProps, useTheme } from "@mui/material/styles";
import { NAV } from "@/config/header";

const SPACING = 32;

export default function Main({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps;
}) {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        flexDirection: "column",
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH}px)`,
        }),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
