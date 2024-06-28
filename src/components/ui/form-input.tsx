import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputProps,
  OutlinedInput,
  outlinedInputClasses,
  useTheme,
} from "@mui/material";
import * as React from "react";

type FormInputProps = InputProps & {
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
