
import {
  Box,
  CircularProgress,
  Typography
} from "@mui/material";

import { Stethoscope } from "lucide-react";
import { motion } from "motion/react";

function Loading({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Stethoscope
          size={55}
          color="#176bba"
        />
      </motion.div>

      <CircularProgress size={30} />

      <Typography color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default Loading;
