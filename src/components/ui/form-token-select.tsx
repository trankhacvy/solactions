import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import * as React from "react";
import { TokenSelect, TokenSelectProps } from "./token-select";

type FormTokenSelectProps = TokenSelectProps & {
  label: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
  fullWidth?: boolean;
};

export const FormTokenSelect = React.forwardRef<
  HTMLSelectElement,
  FormTokenSelectProps
>((props, ref) => {
  const {
    label,
    id,
    helperText,
    error = false,
    fullWidth = false,
    ...inputProps
  } = props;
  const internalId = id ?? React.useId();

  return (
    <FormControl error={error} fullWidth={fullWidth}>
      <FormLabel
        error={error}
        id={internalId}
        htmlFor={internalId}
        sx={{ mb: 1.5 }}
      >
        {label}
      </FormLabel>
      <TokenSelect ref={ref} {...inputProps} />
      <FormHelperText sx={{ mt: 1 }}>{helperText ?? " "}</FormHelperText>
    </FormControl>
  );
});
