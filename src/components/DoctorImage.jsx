
import { useState, useEffect } from "react";
import { Box, Avatar, Typography } from "@mui/material";

function DoctorImage({ doctor }) {
  const baseUrl = import.meta.env.BASE_URL;

  const localImage = `${baseUrl}images/doctor${doctor.id}.jpg`;

  const image = doctor.image?.trim() || "";

  const imageUrl = image
    ? /^(https?:|data:|blob:)/i.test(image)
      ? image
      : `${baseUrl}${image.replace(/^\/+/, "")}`
    : localImage;

  const [src, setSrc] = useState(imageUrl);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(imageUrl);
    setFailed(false);
  }, [imageUrl, localImage]);

  function handleImageError() {
    if (src !== localImage) {
      setSrc(localImage);
    } else {
      setFailed(true);
      console.error("Doctor image not found:", localImage);
    }
  }

  const initials = (doctor.name || "Doctor")
    .replace(/^Dr\.\s*/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  if (failed) {
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
      src={src}
      alt={doctor.name}
      loading="lazy"
      onError={handleImageError}
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
