
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { MotionConfig } from "motion/react";
import theme from "../theme";

import "react-toastify/dist/ReactToastify.css";

function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <MotionConfig reducedMotion="user">
        {children}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          limit={3}
        />
      </MotionConfig>
    </ThemeProvider>
  );
}

export default AppProviders;
