
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#176bba",
      dark: "#123b60",
      light: "#e0f2fe"
    },
    secondary: {
      main: "#0891b2"
    },
    background: {
      default: "#f3f7fb",
      paper: "#ffffff"
    },
    success: {
      main: "#16a34a"
    },
    error: {
      main: "#ef4444"
    },
    warning: {
      main: "#f59e0b"
    },
    text: {
      primary: "#173b60",
      secondary: "#64748b"
    }
  },

  typography: {
    fontFamily: "'Inter', Arial, sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: {
      textTransform: "none",
      fontWeight: 600
    }
  },

  shape: {
    borderRadius: 12
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 18px"
        }
      }
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 5px 25px rgba(23,59,96,0.08)"
        }
      }
    },

    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "outlined"
      }
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20
        }
      }
    }
  }
});

export default theme;
