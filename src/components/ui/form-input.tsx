import {
  FormControl,
  FormHelperText,
  FormLabel,
  OutlinedInput,
  OutlinedInputProps,
  outlinedInputClasses,
  useTheme,
} from "@mui/material";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import * as React from "react";

type FormInputProps = OutlinedInputProps & {
  label: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
};

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (props, ref) => {
    const { label, id, helperText, error = false, ...inputProps } = props;
    const internalId = id ?? React.useId();
    const theme = useTheme();

    return (
      <FormControl error={error} fullWidth={props.fullWidth}>
        <FormLabel
          error={error}
          id={internalId}
          htmlFor="internalId"
          sx={{ mb: 1.5 }}
        >
          {label}
        </FormLabel>
        <OutlinedInput
          ref={ref}
          sx={{
            ...inputProps.sx,
            ...(error
              ? {
                  [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                    borderColor: theme.palette.error["main"],
                  },
                  [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                    borderColor: theme.palette.error["main"],
                  },
                }
              : {}),
          }}
          {...inputProps}
          id={internalId}
          error={error}
        />
        {helperText && (
          <FormHelperText sx={{ mt: 1 }}>{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  },
);

type FormNumberInputProps = NumericFormatProps & {
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
        htmlFor="internalId"
        sx={{ mb: 1.5 }}
      >
        {label}
      </FormLabel>
      {/* @ts-ignore */}
      <NumericFormat
        {...inputProps}
        fixedDecimalScale={true}
        getInputRef={ref}
        customInput={OutlinedInput}
      />
      {helperText && (
        <FormHelperText sx={{ mt: 1 }}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
});
