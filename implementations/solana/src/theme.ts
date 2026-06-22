// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // ou "dark"
    primary: {
      main: "#1976d2", // bleu principal
    },
    secondary: {
      main: "#ff9800", // orange
    },
    background: {
      default: "#f9fafb", // gris clair
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    button: {
      textTransform: "none", // pas de MAJ automatique
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
      styleOverrides: {
        root: {
          padding: "8px 16px",
          borderRadius: "12px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

export default theme;
