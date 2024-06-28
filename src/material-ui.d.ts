import "@mui/material/styles";
import { ColorPartial } from "@mui/material/styles/createPalette";
import "@mui/material/Typography";

declare module "@mui/material/styles" {
  interface Theme {
    customShadows: Record<string, string>;
  }

  interface ThemeOptions {
    customShadows: Record<string, string>;
  }

  interface TypeBackground {
    neutral: string;
  }

  // interface Shadows {
  //   neutral: string;
  // }

  interface TypographyVariants {
    fontWeightSemiBold: React.CSSProperties["fontWeight"];
    fontSecondaryFamily: React.CSSProperties["fontFamily"];
    hero: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    fontWeightSemiBold: React.CSSProperties["fontWeight"];
    fontSecondaryFamily: React.CSSProperties["fontFamily"];
    hero: React.CSSProperties;
  }

  interface Palette {
    neutral: ColorPartial;
  }

  interface PaletteOptions {
    neutral?: ColorPartial;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    fontWeightSemiBold: React.CSSProperties["fontWeight"];
    fontSecondaryFamily: React.CSSProperties["fontFamily"];
  }
}
