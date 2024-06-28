import { Theme } from "@mui/material/styles";
import { TypographyOptions } from "@mui/material/styles/createTypography";

export function remToPx(value: string): number {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number): string {
  return `${value / 16}rem`;
}

const secondaryFont: string = "Barlow, sans-serif";

export const typography: (theme: Theme) => TypographyOptions = (theme) => ({
  fontSecondaryFamily: secondaryFont,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  hero: {
    fontWeight: 800,
    lineHeight: 1,
    fontSize: pxToRem(64),
    [theme.breakpoints.up("md")]: {
      fontSize: pxToRem(80),
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: pxToRem(96),
    },
  },
  h1: {
    fontWeight: 800,
    lineHeight: 1.25,
    fontSize: pxToRem(64),
  },
  h2: {
    fontWeight: 800,
    lineHeight: 56 / 48,
    fontSize: pxToRem(48),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 48 / 40,
    fontSize: pxToRem(40),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(24),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 18,
    fontSize: pxToRem(18),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: "uppercase",
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: "unset",
  },
});
