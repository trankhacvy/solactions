import { Token } from "@/types";
import {
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import * as React from "react";

export type TokenSelectProps = Omit<
  AutocompleteProps<Token, false, false, false>,
  | "renderOption"
  | "renderInput"
  | "getOptionLabel"
  | "isOptionEqualToValue"
  | "ref"
>;

export const TokenSelect = React.forwardRef<
  HTMLSelectElement,
  TokenSelectProps
>((props, ref) => {
  const theme = useTheme();

  return (
    <Autocomplete
      ref={ref}
      {...props}
      renderOption={(props, option) => {
        return (
          <ListItem {...props} key={option.address}>
            <ListItemAvatar sx={{ minWidth: "auto" }}>
              <Avatar
                src={option.icon}
                alt={option.name}
                sx={{ width: 24, height: 24 }}
              />
            </ListItemAvatar>
            <ListItemText
              primaryTypographyProps={{
                fontSize: theme.typography.body2.fontSize,
                lineHeight: theme.typography.body2.lineHeight,
              }}
              primary={option.symbol}
            />
          </ListItem>
        );
      }}
      renderInput={({
        InputLabelProps: _InputLabelProps,
        InputProps,
        ...rest
      }) => {
        return (
          <OutlinedInput
            {...rest}
            startAdornment={
              props.value ? (
                <Box
                  component="img"
                  width={20}
                  height={20}
                  src={props.value.icon}
                  alt={props.value.name}
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                  }}
                />
              ) : null
            }
            ref={InputProps.ref}
            inputProps={rest.inputProps}
            autoFocus
          />
        );
      }}
      getOptionLabel={(option) => option.symbol}
      isOptionEqualToValue={(option, value) => option.address === value.address}
    />
  );
});
