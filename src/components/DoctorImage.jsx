
import { useState, useEffect } from "react";
import { Box, Avatar, Typography } from "@mui/material";

function DoctorImage({ doctor }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [doctor.image]);

  const initials = (doctor.name || "Doctor")
    .replace(/^Dr\.\s*/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  if (failed || !doctor.image) {
    return (
      <Box
        sx={{
          height: 250,
          background: "linear-gradient(135deg,#e0f2fe,#ccfbf1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            fontSize: 35,
            fontWeight: 700,
            bgcolor: "#176bba"
          }}
        >
          {initials}
        </Avatar>

        <Typography fontWeight={700}>
          {doctor.name}
        </Typography>

        <Typography color="text.secondary" fontSize={13}>
          {doctor.specialization}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={doctor.image}
      alt={doctor.name}
      loading="lazy"
      onError={() => setFailed(true)}
      sx={{
        width: "100%",
        height: 250,
        objectFit: "cover",
        objectPosition: "center 20%",
        display: "block"
      }}
    />
  );
}

export default DoctorImage;
