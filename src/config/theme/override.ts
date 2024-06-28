import { Theme, Components, alpha } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { autocompleteClasses, formLabelClasses } from "@mui/material";
import switchBaseClasses from "@mui/material/internal/switchBaseClasses";

export const components = (
  theme: Theme,
): Components<Omit<Theme, "components">> => {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          WebkitOverflowScrolling: "touch",
        },
        body: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          ...theme.typography.body2,
        },
        "#root": {
          width: "100%",
          height: "100%",
        },
        input: {
          "&[type=number]": {
            MozAppearance: "textfield",
            "&::-webkit-outer-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
            "&::-webkit-inner-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
          },
        },
        img: {
          maxWidth: "100%",
          display: "inline-block",
          verticalAlign: "bottom",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(theme.palette.grey[900], 0.8),
        },
        invisible: {
          background: "transparent",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "inherit",
      },
      styleOverrides: {
        containedInherit: {
          color: theme.palette.common.white,
          backgroundColor: theme.palette.grey[800],
          "&:hover": {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.grey[700],
          },
        },
        sizeLarge: {
          minHeight: 48,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          // @ts-ignore
          boxShadow: theme.customShadows.card,
          borderRadius: Number(theme.shape.borderRadius) * 2,
          position: "relative",
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: "h6" },
        subheaderTypographyProps: { variant: "body2" },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          paddingInline: theme.spacing(3),
          paddingTop: 0,
          paddingBottom: theme.spacing(3),
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            transitionDelay: "9999s",
            transitionProperty: "background-color, color",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: alpha(theme.palette.grey[500], 0.24),
          },
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.grey[800],
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.grey[800],
            borderWidth: "2px",
          },
        },
        input: {
          "&:-webkit-autofill": {
            WebkitBoxShadow: "inherit",
            WebkitTextFillColor: "inherit",
            caretColor: "inherit",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: theme.palette.grey[800],
            fontWeight: "600",
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.grey[200],
        },
        head: {
          color: theme.palette.text.secondary,
          // @ts-ignore
          backgroundColor: theme.palette.background.neutral,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[800],
        },
        arrow: {
          color: theme.palette.grey[800],
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...theme.typography.body2,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: theme.palette.text.primary,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: theme.palette.grey[800],
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          ...theme.typography.subtitle2,
          color: theme.palette.grey[600],
          "&.Mui-focused:not(.Mui-error)": {
            color: theme.palette.grey[800],
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...theme.typography.body2,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          blur: "20px",
          boxShadow: theme.customShadows.dropdown,
          padding: "4px",
          borderRadius: "10px",
        },
        listbox: {
          padding: 0,
        },
        option: {
          borderRadius: "6px",
          gap: "8px",
          [`&.${autocompleteClasses.option}`]: {
            padding: "6px 8px",
          },
          [`&.${autocompleteClasses.option}[aria-selected="true"]`]: {
            backgroundColor: alpha(theme.palette.grey["500"], 0.16),
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 58,
          height: 38,
          padding: "9px 13px 9px 12px",
          "& .MuiSwitch-switchBase": {
            padding: "12px",
            position: "absolute",
            left: "3px",
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(13px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.dark
                    : theme.palette.primary.main,
                opacity: 1,
                border: 0,
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: theme.palette.primary.main,
              border: "6px solid #fff",
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color:
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[600],
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 14,
            height: 14,
            boxShadow: "none",
          },
          "& .MuiSwitch-track": {
            borderRadius: "14px",
            backgroundColor:
              theme.palette.mode === "light"
                ? alpha(theme.palette.grey[500], 0.48)
                : alpha(theme.palette.grey[500], 0.48),
            opacity: 1,
            transition: theme.transitions.create(["background-color"], {
              duration: 500,
            }),
          },
        },
      },
    },
  };
};
