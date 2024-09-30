"use client";

import { OutlinedInput, Stack } from "@mui/material";
import { useState } from "react";
import { CheckIcon } from "lucide-react";
import LoadingButton from "@mui/lab/LoadingButton";
import { BlinkActionStatus } from ".";

export interface ButtonProps {
  text: string | null;
  loading?: boolean;
  status?: BlinkActionStatus;
  disabled?: boolean;
  onClick: (params?: Record<string, string>) => void;
  withInput?: boolean;
}

export const ActionInput = ({
  placeholder,
  name,
  button,
  disabled,
}: InputProps) => {
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
            onClick={() => {
              button.onClick({ [name as any]: value });
            }}
            disabled={button.disabled || !value.trim()}
          />
        }
      />
    </Stack>
  );
};

export interface InputProps {
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  button: ButtonProps;
}

export const ActionButton = ({
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
      endIcon={status === BlinkActionStatus.SUCCESS ? <CheckIcon /> : null}
    >
      {status === BlinkActionStatus.SUCCESS ? "" : text}
    </LoadingButton>
  );
};
