import { ThemeProvider, StyledEngineProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";

export default function GlobalThemeProvider({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
