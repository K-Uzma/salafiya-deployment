import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      contrastText: "#ffffff",
      main: "#2e7d32",
    },
    error: {
      contrastText: "#FFFFFF",
      dark: "#FF0000",
      light: "#FFCDD2",
      main: "#D93535",
    },
  },
  typography: {
    fontSize: 12, // Base font size
    h2: {
      fontSize: "1rem",
      "@media (min-width:600px)": {
        fontSize: "2rem",
      },
      "@media (min-width:900px)": {
        fontSize: "2.5rem",
      },
      "@media (min-width:1200px)": {
        fontSize: "3rem",
      },
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "black",
          color: "white",
          maxWidth: "320px",
          padding: "10px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#1A1A1A",
            color: "#F2F2F2",
          },
          "&.Mui-selected ": {
            color: "#2e7d32",
            backgroundColor: "#1A1A1A",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            backgroundColor: "#FFFFFF",
            borderRadius: "4px",
            padding: "15px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          padding: "8px 15px",
        },
      },
    },
  },
});
