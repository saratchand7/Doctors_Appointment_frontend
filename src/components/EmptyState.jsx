
import { Box, Button, Typography } from "@mui/material";
import { Stethoscope, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function EmptyState({
  title = "No doctors found",
  message = "Explore our available healthcare specialists.",
  buttonText = "Find Doctors",
  path = "/doctors",
  Icon = Stethoscope
}) {
  const navigate = useNavigate();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        textAlign: "center",
        background: "white",
        borderRadius: 4,
        padding: 5,
        margin: 2
      }}
    >
      <Icon size={60} color="#176bba" />

      <Typography variant="h5" mt={2} fontWeight={700}>
        {title}
      </Typography>

      <Typography color="text.secondary" mt={1} mb={3}>
        {message}
      </Typography>

      <Button
        variant="contained"
        endIcon={<ArrowRight size={18} />}
        onClick={() => navigate(path)}
      >
        {buttonText}
      </Button>
    </Box>
  );
}

export default EmptyState;
