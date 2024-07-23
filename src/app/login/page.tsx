"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { AuthButton } from "./auth-button";

export default function Home() {
  return (
    <>
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            component="img"
            width="120px"
            height="120px"
            sx={{
              objectFit: "cover",
              verticalAlign: "middle",
              borderRadius: 2,
            }}
            src="/logo.png"
          />
          <Typography variant="h4">Let's put the crypto on Twitter</Typography>
          <AuthButton />
        </CardContent>
      </Card>
    </>
  );
}
