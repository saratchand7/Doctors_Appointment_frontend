
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion } from "motion/react";

import {
  Box,
  Card,
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress
} from "@mui/material";

import {
  Camera,
  Trash2,
  UserRound,
  UserPlus,
  Eye,
  EyeOff
} from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value
    }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Select a JPG, PNG or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be below 10 MB.");
      e.target.value = "";
      return;
    }

    setImageLoading(true);

    const imageUrl = URL.createObjectURL(file);

    try {
      const img = new Image();
      img.src = imageUrl;

      await img.decode();

      const canvas = document.createElement("canvas");

      canvas.width = 200;
      canvas.height = 200;

      const ctx = canvas.getContext("2d");
      const cropSize = Math.min(img.width, img.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 200, 200);

      ctx.drawImage(
        img,
        (img.width - cropSize) / 2,
        (img.height - cropSize) / 2,
        cropSize,
        cropSize,
        0,
        0,
        200,
        200
      );

      let quality = 0.8;
      let compressed = canvas.toDataURL("image/jpeg", quality);

      while (compressed.length > 70000 && quality > 0.1) {
        quality = Math.max(0.1, quality - 0.1);
        compressed = canvas.toDataURL("image/jpeg", quality);
      }

      if (compressed.length > 70000) {
        throw new Error("Image is too large.");
      }

      setForm((previous) => ({
        ...previous,
        image: compressed
      }));

      toast.success("Profile picture ready!");
    } catch {
      toast.error("Unable to process image.");
    } finally {
      URL.revokeObjectURL(imageUrl);
      setImageLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeImage() {
    setForm((previous) => ({
      ...previous,
      image: ""
    }));

    toast.info("Profile picture removed.");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading || imageLoading) return;

    if (form.name.trim().length < 3) {
      toast.error("Enter a valid full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const email = form.email.trim().toLowerCase();

      const response = await api.get("/users", {
        params: { email }
      });

      if (response.data.length > 0) {
        toast.warning("Email is already registered.");
        return;
      }

      const patient = {
        name: form.name.trim(),
        email,
        phone: form.phone,
        password: form.password,
        role: "patient",
        image: form.image
      };

      const payloadSize = new Blob([
        JSON.stringify(patient)
      ]).size;

      if (payloadSize > 95000) {
        toast.error("Registration data is too large.");
        return;
      }

      await api.post("/users", patient);

      toast.success("Account created successfully!");

      navigate("/login", { replace: true });
    } catch (error) {
      if (error.response?.status === 413) {
        toast.error("Image is too large.");
      } else {
        toast.error("Registration failed. Check JSON Server.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "85vh",
        display: "grid",
        placeItems: "center",
        p: 3
      }}
    >
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: { xs: 3, sm: 4 }
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
        >
          Create Account
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          mt={1}
          mb={3}
        >
          Start your healthcare journey with MediCare.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              p: 3,
              bgcolor: "#f0f8fc",
              borderRadius: 4,
              border: "2px dashed #c5dfed"
            }}
          >
            <Avatar
              src={form.image || undefined}
              sx={{
                width: 110,
                height: 110,
                bgcolor: "#dbeafe",
                color: "#176bba"
              }}
            >
              <UserRound size={48} />
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              hidden
              disabled={loading || imageLoading}
            />

            <Button
              variant="contained"
              startIcon={<Camera size={18} />}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || imageLoading}
            >
              {imageLoading
                ? "Processing Image..."
                : form.image
                ? "Change Profile Picture"
                : "Upload Profile Picture"}
            </Button>

            <Typography variant="caption" color="text.secondary">
              JPG, PNG or WebP · Maximum 10 MB
            </Typography>

            {form.image && (
              <Button
                color="error"
                size="small"
                startIcon={<Trash2 size={16} />}
                onClick={removeImage}
                disabled={loading || imageLoading}
              >
                Remove Picture
              </Button>
            )}
          </Box>

          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <TextField
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            slotProps={{ htmlInput: { maxLength: 10 } }}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword
                        ? <EyeOff size={18} />
                        : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || imageLoading}
            startIcon={
              loading
                ? <CircularProgress size={18} />
                : <UserPlus size={19} />
            }
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </Box>

        <Typography textAlign="center" mt={3} fontSize={14}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </Typography>
      </Card>
    </Box>
  );
}

export default Register;
