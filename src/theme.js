import { createTheme } from "@mui/material/styles";

/**
 * The app's MUI theme: colors and fonts used everywhere.
 * Pastel star theme colors can go here later.
 */
const theme = createTheme({
  palette: {
    background: {
      // Transparent so the animated Sky shows through
      default: "transparent",
    },
  },
});

export default theme;