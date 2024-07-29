"use client";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";

import { ActionGetResponse } from "@solana/actions";
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
    <Card
      sx={{
        maxWidth: 360,
        mx: "auto",
        transform: "translateY(-104px)",
      }}
    >
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
                    alert("xxx");
                    // setStatus(ProcessStatus.PROCESSING);

                    // const response = await fetcher<ActionPostResponse>(
                    //   acc.href,
                    //   {
                    //     method: "POST",
                    //     body: JSON.stringify({
                    //       account: publicKey!.toBase58(),
                    //     }),
                    //   },
                    // );

                    // const tx = Transaction.from(
                    //   Buffer.from(response.transaction, "base64"),
                    // );

                    // const connection = new Connection(clusterApiUrl("devnet"));

                    // const signature = await sendTransaction(tx, connection);

                    // await connection.confirmTransaction(signature, "confirmed");

                    // setStatus(ProcessStatus.SUCCESS);

                    // setTimeout(() => {
                    //   setStatus(ProcessStatus.IDLE);
                    // }, 1500);

                    const encodedTx =
                      "AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVkZDzPBPQFrsKuruNUfdTHRS5pcMzLKxSNCmbNqTBC9Dsdu1T87BNYQwG4NYJe+lyca92X7Seo3EUttlhQtMDAgAGC0iU7FvC/vu62sVvaz02tZ/bz6mpHVBNhXkeSaJkfXMkOK9qmr3JAwiZZmcR26NBu7NiHXUYODqD20TNcm3P7D1TR+pWn5ZGA8aFvrwr59EweCN7Hss+SCwSWf7N/OPJj1GB/WjDeUWLHvCSf9sYH5UxyjKPBhq+tzSZE2gxbPiPDHARkzo0js9VJDTWKXBIL2hzq8KtrSYxTn85UeO64GcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwtqCYXlzhrq8mEyvvhhNTOfGeIyz37PhBiUwnXHZv4jJclj04kifG7PRApFI4NgwtaE5na/xCEBI572Nvp+FkLcGWx49F8RTidUn9rBMPNWLhscxqg/bVJttG8A/gpRgan1RcZLFxRIYzJTD1K8X9Y2u4Im6H9ROPb2YoAAAAABt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKkScOAQmLlFrsSM8xwcnAi9O9lg6t5sExcdU57/a0tCBQYFAgABNAAAAABgTRYAAAAAAFIAAAAAAAAABt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKkKAgEJQwAASJTsW8L++7raxW9rPTa1n9vPqakdUE2FeR5JomR9cyQBSJTsW8L++7raxW9rPTa1n9vPqakdUE2FeR5JomR9cyQHBwADBgEFCgkACgMBAwAJBwEAAAAAAAAACAYCAQAAAAWjASEGAAAAR01CICMyAwAAAEdNQmAAAABodHRwczovL2Jyb3duLWxveWFsLXN0b2F0LTczNC5teXBpbmF0YS5jbG91ZC9pcGZzL1FtUjVUeXgzTXZwaUNLdGpUVkM0d1Z6UmlncHVqQ3Y5Ym52UUtVNFpNUXpONU5YAgEBAAAASJTsW8L++7raxW9rPTa1n9vPqakdUE2FeR5JomR9cyQBZAAAAQAICAQBAAAAAgoFChEBAQAAAAAAAAA=";

                    const tx = Transaction.from(
                      Buffer.from(encodedTx, "base64"),
                    );

                    const connection = new Connection(clusterApiUrl("devnet"));

                    const signature = await sendTransaction(tx, connection);

                    await connection.confirmTransaction(signature, "confirmed");
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

          {inputs.map((action: any, idx) => {
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
