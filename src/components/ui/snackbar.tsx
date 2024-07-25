"use client";

import {
  Slide,
  Snackbar,
  type SnackbarProps,
  type SlideProps,
  Alert,
  type AlertProps,
} from "@mui/material";
import type { FC } from "react";
import { create } from "zustand";

type Props = Omit<SnackbarProps, "open" | "key"> & Pick<AlertProps, "severity">;

const useSnackbarStore = create<{
  props: Props;
  key: number;
  open: boolean;
}>(() => ({
  props: {},
  key: 0,
  open: false,
}));

export const openSnackbar = (props: Props) => {
  useSnackbarStore.setState({ props, key: new Date().valueOf(), open: true });
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const SnackbarHost: FC = () => {
  const snackbarStore = useSnackbarStore();
  const { severity, message, ...rest } = snackbarStore.props;

  const handleClose: SnackbarProps["onClose"] | AlertProps["onClose"] = (
    e,
    reason,
  ) => {
    useSnackbarStore.setState({ open: false });
    snackbarStore.props.onClose?.(e, reason);
  };

  return (
    <Snackbar
      autoHideDuration={3500}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      TransitionComponent={SlideTransition}
      {...rest}
      open={snackbarStore.open}
      onClose={handleClose}
      key={snackbarStore.key}
    >
      <Alert
        onClose={handleClose as AlertProps["onClose"]}
        severity={severity ?? "info"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
