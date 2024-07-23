import { NumberInputProps } from "@mui/base/Unstable_NumberInput";
import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import * as React from "react";
import { NumberInput } from "@/components/ui/number-input";

type FormNumberInputProps = NumberInputProps & {
  label: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
  fullWidth?: boolean;
};

export const FormNumberInput = React.forwardRef<
  HTMLInputElement,
  FormNumberInputProps
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
      <NumberInput ref={ref} error={error} {...inputProps} />
      <FormHelperText sx={{ mt: 1 }}>{helperText ?? " "}</FormHelperText>
    </FormControl>
  );
});

export default FormNumberInput;
