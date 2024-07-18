"use client";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";

import { ActionGetResponse, ActionPostResponse } from "@solana/actions";
import { SelectDonationProfile } from "@/types";
import { alpha } from "@mui/system";
import {
  Box,
  CircularProgress,
  OutlinedInput,
  Stack,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import fetcher from "@/lib/fetcher";
import { useMemo, useState } from "react";
import { CheckIcon } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, Transaction, clusterApiUrl } from "@solana/web3.js";
import LoadingButton from "@mui/lab/LoadingButton";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

enum ProcessStatus {
  IDLE,
  PROCESSING,
  SUCCESS,
  FAILED,
}

export function ProfileCard({ profile }: { profile: SelectDonationProfile }) {
  const theme = useTheme();

  const { connected, publicKey, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();

  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);

  const { data, isFetching } = useQuery({
    queryKey: ["action", profile.slug],
    queryFn: () => fetcher<ActionGetResponse>(`/api/profile/${profile.slug}`),
    refetchOnWindowFocus: false,
  });

  const buttons = useMemo(
    () => data?.links?.actions.filter((it) => !it.parameters) ?? [],
    [data],
  );

  const inputs = useMemo(
    () => data?.links?.actions.filter((it) => !!it.parameters) ?? [],
    [data],
  );

  return (
    <Card sx={{ maxWidth: 360, mx: "auto" }}>
      <Box p={2}>
        <CardMedia
          component="img"
          image={profile.image ?? ""}
          alt={profile.name ?? ""}
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
          {profile.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile.bio}
        </Typography>
      </CardContent>

      {isFetching ? (
        <CardActions
          sx={{ display: "flex", flexDirection: "column", p: 2, pt: 0, gap: 2 }}
        >
          <CircularProgress />
        </CardActions>
      ) : (
        <CardActions
          sx={{ display: "flex", flexDirection: "column", p: 2, pt: 0, gap: 2 }}
        >
          <Stack flexDirection="row" gap={2} alignItems="center" width="100%">
            {buttons.map((acc, idx) => (
              <ActionButton
                text={acc.label}
                loading={status === ProcessStatus.PROCESSING}
                disabled={data?.disabled}
                onClick={async () => {
                  if (!connected) {
                    setVisible(true);
                    return;
                  }
                  try {
                    setStatus(ProcessStatus.PROCESSING);

                    const response = await fetcher<ActionPostResponse>(
                      acc.href,
                      {
                        method: "POST",
                        body: JSON.stringify({
                          account: publicKey!.toBase58(),
                        }),
                      },
                    );

                    const tx = Transaction.from(
                      Buffer.from(response.transaction, "base64"),
                    );

                    const connection = new Connection(clusterApiUrl("devnet"));

                    const signature = await sendTransaction(tx, connection);

                    await connection.confirmTransaction(signature, "confirmed");

                    setStatus(ProcessStatus.SUCCESS);

                    setTimeout(() => {
                      setStatus(ProcessStatus.IDLE);
                    }, 1500);
                  } catch (error) {
                    setStatus(ProcessStatus.FAILED);
                    console.error(error);
                  }
                }}
                status={status}
                key={idx}
              />
            ))}
          </Stack>

          {inputs.map((action, idx) => {
            return (
              <ActionInput
                key={idx}
                placeholder={action.parameters?.[0].label}
                disabled={data?.disabled}
                name={action.parameters?.[0].name}
                button={{
                  text: action.label,
                  loading: status === ProcessStatus.PROCESSING,
                  disabled: data?.disabled,
                  onClick: async (formValue) => {
                    if (!connected) {
                      setVisible(true);
                      return;
                    }

                    setStatus(ProcessStatus.PROCESSING);

                    const name = action.parameters?.[0].name!;

                    try {
                      const response = await fetcher(
                        action.href.replace(
                          `{${name}}`,
                          // @ts-ignore
                          formValue[name as any],
                        ),
                        {
                          method: "POST",
                          body: JSON.stringify({
                            account: publicKey?.toBase58(),
                          }),
                        },
                      );

                      const tx = Transaction.from(
                        Buffer.from(response.transaction, "base64"),
                      );

                      const connection = new Connection(
                        clusterApiUrl("devnet"),
                      );

                      const signature = await sendTransaction(tx, connection);

                      await connection.confirmTransaction(
                        signature,
                        "confirmed",
                      );

                      setStatus(ProcessStatus.SUCCESS);

                      setTimeout(() => {
                        setStatus(ProcessStatus.IDLE);
                      }, 1500);
                    } catch (error) {
                      setStatus(ProcessStatus.FAILED);
                      console.error(error);
                    }
                  },
                  status: status,
                  withInput: true,
                }}
              />
            );
          })}
        </CardActions>
      )}
    </Card>
  );
}

interface ButtonProps {
  text: string | null;
  loading?: boolean;
  status?: ProcessStatus;
  disabled?: boolean;
  onClick: (params?: Record<string, string>) => void;
  withInput?: boolean;
}

interface InputProps {
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  button: ButtonProps;
}

const ActionInput = ({ placeholder, name, button, disabled }: InputProps) => {
  const [value, onChange] = useState("");

  return (
    <Stack width="100%">
      <OutlinedInput
        sx={{ width: "100%" }}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        endAdornment={
          <ActionButton
            {...button}
            onClick={() => button.onClick({ [name as any]: value })}
            disabled={button.disabled || value === ""}
          />
        }
      />
    </Stack>
  );
};

const ActionButton = ({
  text,
  loading,
  disabled,
  status,
  onClick,
  withInput = false,
}: ButtonProps) => {
  return (
    <LoadingButton
      sx={
        withInput
          ? {
              px: 3,
              whiteSpace: "nowrap",
              ml: 1,
            }
          : { flex: 1 }
      }
      onClick={() => onClick()}
      disabled={disabled}
      loading={loading}
      variant="contained"
      endIcon={status === ProcessStatus.SUCCESS ? <CheckIcon /> : null}
    >
      {status === ProcessStatus.SUCCESS ? "" : text}
    </LoadingButton>
  );
};
