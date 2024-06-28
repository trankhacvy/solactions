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
import { donateOptions } from "@/config/tokens";

export function PreviewCard({ user }: { user: SelectUser }) {
  const theme = useTheme();

  return (
    <Box
      p={{ xs: 3, md: 5 }}
      bgcolor={theme.palette.background.neutral}
      height="100%"
    >
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
            {donateOptions.map((option) => (
              <Button sx={{ flex: 1 }} color="inherit">
                {option} {user.acceptToken?.symbol}
              </Button>
            ))}
          </Stack>
          <Stack width="100%">
            <OutlinedInput
              sx={{ width: "100%" }}
              placeholder="Enter a custom amount"
              endAdornment={
                <Button
                  sx={{
                    px: 3,
                    whiteSpace: "nowrap",
                    ml: 1,
                  }}
                  color="inherit"
                >
                  Donate
                </Button>
              }
            />
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
}
