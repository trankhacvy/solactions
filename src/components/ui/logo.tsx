import { Box, BoxProps, Typography } from "@mui/material";

export function Logo(props: BoxProps) {
  return (
    <Box
      component="a"
      display="inline-flex"
      alignItems="center"
      gap={2}
      href="/"
      {...props}
    >
      <Box
        component="img"
        width="40px"
        height="40px"
        sx={{
          objectFit: "cover",
          verticalAlign: "middle",
        }}
        src="/logo.png"
      />
    </Box>
  );
}
