import {
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  RadioGroupProps,
  FormControlLabel,
  FormControlLabelProps,
  useTheme,
  useRadioGroup,
  Stack,
  Typography,
  alpha,
  Radio,
} from "@mui/material";
import * as React from "react";

type FormCustomRadioGroupProps = RadioGroupProps & {
  label: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
  fullWidth?: boolean;
  options?: Pick<FormControlLabelProps, "label" | "value">[];
};

export const FormCustomRadioGroup = React.forwardRef<
  HTMLSelectElement,
  FormCustomRadioGroupProps
>((props, ref) => {
  const {
    label,
    id,
    helperText,
    error = false,
    fullWidth = false,
    options = [],
    ...radioGroupProps
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
      <RadioGroup
        {...radioGroupProps}
        aria-labelledby={internalId}
        sx={{
          flexDirection: "row",
          flexWrap: "unset",
          gap: 3,
          width: "100%",
        }}
      >
        {options.map((op) => (
          <CustomFormControlLabel
            {...op}
            key={op.value as string}
            control={<Radio />}
          />
        ))}
      </RadioGroup>

      <FormHelperText sx={{ mt: 1 }}>{helperText ?? " "}</FormHelperText>
    </FormControl>
  );
});

function CustomFormControlLabel(props: FormControlLabelProps) {
  const theme = useTheme();
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value == props.value;
  }

  return (
    <FormControlLabel
      {...props}
      sx={{
        display: "flex",
        border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
        boxShadow: checked ? `0 0 0 2px ${theme.palette.text.primary}` : "none",
        borderRadius: 1,
        padding: 2.5,
        flex: 1,
        ml: 0,
      }}
      label={
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          gap={3}
        >
          <Typography fontWeight="bold">{props.label}</Typography>
        </Stack>
      }
    />
  );
}
