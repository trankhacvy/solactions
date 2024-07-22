import * as React from "react";

import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps as NumInputProps,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { grey } from "@mui/material/colors";
import { InputBase, inputBaseClasses, styled, alpha } from "@mui/material";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export const NumberInput = React.forwardRef(function (
  props: NumInputProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { startAdornment, endAdornment, slotProps, ...rest } = props;
  return (
    <BaseNumberInput
      slots={{
        root: InputRoot,
        input: InputElement,
        incrementButton: Button,
        decrementButton: Button,
      }}
      startAdornment={
        startAdornment ? (
          <InputAdornment>{startAdornment}</InputAdornment>
        ) : null
      }
      endAdornment={
        endAdornment ? <InputAdornment>{endAdornment}</InputAdornment> : null
      }
      slotProps={{
        ...slotProps,
        incrementButton: {
          ...slotProps?.incrementButton,
          type: "button",
          children: <ChevronUpIcon />,
        },
        decrementButton: {
          ...slotProps?.decrementButton,
          type: "button",
          children: <ChevronDownIcon />,
        },
      }}
      {...rest}
      ref={ref}
    />
  );
});

export default NumberInput;

const InputRoot = styled("div")<any>(({ theme, ownerState }) => {
  return `
    font-weight: 400;
    border-radius: 8px;
    line-height: 1.3125em;
    font-size: 1rem;
    color: ${grey[800]};
    border: 1px solid ${alpha(theme.palette.grey[500], 0.24)};
    display: grid;
    grid-template-columns: ${ownerState.startAdornment ? "auto" : ""} 1fr ${
      ownerState.endAdornment ? "auto" : ""
    } 23px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    padding: 4px;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  
    &.${numberInputClasses.focused} {
      border-color: ${theme.palette.grey[800]};
      box-shadow: ${theme.palette.grey[800]} 0px 0px 0px 2px;
    }

    &.${numberInputClasses.error} {
      border-color: ${theme.palette.error.main};
      &:hover {
        border-color: ${theme.palette.error.main};
      }
      &.${numberInputClasses.focused} {
        border-color: ${theme.palette.error.main};
        box-shadow: ${theme.palette.error.main} 0px 0px 0px 2px;
      }
    }
  
    &:hover {
      border-color: ${theme.palette.grey[800]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `;
});

const InputElement = styled(InputBase)(
  ({ theme }) => `
    grid-row: 1/3;
    width: 100%;
    border: 0px;
    height: 46px;
    &.${inputBaseClasses.focused} {
      & .${inputBaseClasses.input} {
        height: 1.4375em;
        padding: 0px 14px;
      }
    }
    & .${inputBaseClasses.input} {
      height: 100%;
      padding: 0px 14px;
    }
  `,
);

const Button = styled("button")(
  ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    font-size: 1rem;
    line-height: 1;
    box-sizing: border-box;
    background: white;
    border: 0;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
    width: 23px;
    height: 23px;
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 4/5;
      grid-row: 1/2;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      border: 1px solid;
      border-bottom: 0;
      border-color: ${alpha(theme.palette.grey[500], 0.24)};
      color: ${grey[800]};
  
      &:hover {
        cursor: pointer;
        color: #FFF;
        background: ${theme.palette.primary.main};
        border-color: ${theme.palette.primary.main};
      }
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 4/5;
      grid-row: 2/3;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      border: 1px solid;
      border-color: ${alpha(theme.palette.grey[500], 0.24)};
      color: ${grey[800]};
  
      &:hover {
        cursor: pointer;
        color: #FFF;
        background: ${theme.palette.primary.main};
        border-color: ${theme.palette.primary.main};
      }
    }
  
  `,
);

const InputAdornment = styled("div")(
  ({ theme }) => `
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-row: 1/3;
`,
);
