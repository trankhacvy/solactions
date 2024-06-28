import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

export function Partner(): JSX.Element {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        py: 17,
      }}
    >
      <Container>
        <Typography textAlign="center" color="neutral.800" variant="body2">
          We work with people from over the world
        </Typography>
        <Stack flexDirection="row" alignItems="center" gap={3}>
          partners
        </Stack>
      </Container>
    </Box>
  );
}
