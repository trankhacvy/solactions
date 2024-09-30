"use client";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";

import { ActionGetResponse, LinkedAction } from "@solana/actions";
import { alpha } from "@mui/system";
import { Box, Stack, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ActionButton, ActionInput } from "./action-control";

export enum BlinkActionStatus {
  IDLE,
  PROCESSING,
  SUCCESS,
  FAILED,
}

type BlinkCardProps = {
  actions: ActionGetResponse;
  onClick: (action: LinkedAction) => void;
  status: BlinkActionStatus;
};

export function BlinkCard({ actions, status, onClick }: BlinkCardProps) {
  const theme = useTheme();

  const { icon, title, description, label, disabled, links, error } = actions;

  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const buttons = useMemo(
    () => links?.actions.filter((it) => !it.parameters) ?? [],
    [links],
  );

  const inputs = useMemo(
    () => links?.actions.filter((it) => !!it.parameters) ?? [],
    [links],
  );

  return (
    <Card sx={{ maxWidth: 448, mx: "auto" }}>
      <Box p={2}>
        <CardMedia
          component="img"
          image={icon ?? ""}
          alt={title ?? ""}
          sx={{
            aspectRatio: "1/1",
            bgcolor: alpha(theme.palette.grey["500"], 0.24),
            borderRadius: 2,
            overflow: "hidden",
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
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>

      <CardActions
        sx={{ display: "flex", flexDirection: "column", p: 2, pt: 0, gap: 2 }}
      >
        <Stack flexDirection="row" gap={2} alignItems="center" width="100%">
          {buttons.map((acc, idx) => (
            <ActionButton
              text={acc.label}
              loading={status === BlinkActionStatus.PROCESSING}
              disabled={disabled}
              onClick={() => {
                if (!connected) {
                  setVisible(true);
                  return;
                }
                onClick(acc);
              }}
              status={status}
              key={idx}
            />
          ))}
        </Stack>

        {inputs.map((action: LinkedAction, idx) => {
          return (
            <ActionInput
              key={idx}
              placeholder={action.parameters?.[0]?.label}
              disabled={disabled}
              name={action.parameters?.[0]?.name}
              button={{
                text: action.label,
                loading: status === BlinkActionStatus.PROCESSING,
                disabled: disabled,
                onClick: (formValue) => {
                  if (!connected) {
                    setVisible(true);
                    return;
                  }

                  const name = action.parameters?.[0]?.name;

                  if (name && formValue && formValue[name]) {
                    onClick({
                      ...action,
                      href: action.href.replace(
                        `{${name}}`,
                        formValue[name] as string,
                      ),
                    });
                  }
                },
                status,
                withInput: true,
              }}
            />
          );
        })}
      </CardActions>
    </Card>
  );
}
