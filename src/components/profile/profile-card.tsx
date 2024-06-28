"use client";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

import { SelectUser } from "@/types";
import { alpha } from "@mui/system";
import { Box, OutlinedInput, Stack, useTheme } from "@mui/material";

export function ProfileCard({ user }: { user: SelectUser }) {
  const theme = useTheme();

  return (
    <Card sx={{ maxWidth: 360, mx: "auto" }}>
      <Box p={2}>
        <CardMedia
          component="img"
          image={user.avatar ?? ""}
          alt={user.name ?? ""}
          sx={{
            aspectRatio: "1/1",
            bgcolor: alpha(theme.palette.grey["500"], 0.24),
            borderRadius: 1,
          }}
        />
      </Box>
      <CardContent
        sx={{
          px: 2,
          pb: 2,
          pt: 0,
        }}
      >
        <Typography gutterBottom variant="h5" component="div">
          {user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.bio}
        </Typography>
      </CardContent>

      <CardActions
        sx={{ display: "flex", flexDirection: "column", p: 2, pt: 0, gap: 2 }}
      >
        <Stack flexDirection="row" gap={2} alignItems="center" width="100%">
          <Button sx={{ flex: 1 }} color="inherit">
            $10
          </Button>
          <Button sx={{ flex: 1 }} color="inherit">
            $20
          </Button>
          <Button sx={{ flex: 1 }} color="inherit">
            $30
          </Button>
        </Stack>
        <Stack width="100%">
          <OutlinedInput
            sx={{ width: "100%" }}
            placeholder="Enter a custom USD amount"
            endAdornment={
              <Button
                sx={{
                  px: 3,
                  whiteSpace: "nowrap",
                  ml: 1,
                }}
                color="inherit"
              >
                Buy mother
              </Button>
            }
          />
        </Stack>
      </CardActions>
    </Card>
  );
}
