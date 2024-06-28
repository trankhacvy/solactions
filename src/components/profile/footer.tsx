import { Divider, Stack, Typography } from "@mui/material";

import React from "react";
import { Box } from "@mui/system";

export function Footer(): JSX.Element {
  return (
    <Box component="footer">
      <Divider />
      <Stack
        sx={{
          px: {
            xs: 2,
            md: 3,
          },
          py: 3,
        }}
      >
        <Typography fontWeight="semibold" color="text.secondary">
          Made with ♥︎ by 3links.
        </Typography>
      </Stack>
    </Box>
  );
}
