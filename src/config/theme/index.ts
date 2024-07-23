import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { typography } from "./typography";
import { palette } from "./palette";
import { customShadows, shadows } from "./shadows";
import { components } from "./override";

let theme = createTheme({
  palette: palette(),
  shadows: shadows(),
  shape: { borderRadius: 8 },
  customShadows: customShadows(),
});

theme = createTheme(theme, {
  typography: typography(theme),
});

// override
theme = createTheme(theme, {
  components: components(theme),
});

export default responsiveFontSizes(theme);
export * from "./css";
