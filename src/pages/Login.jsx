
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import { toast } from "react-toastify";
import { motion } from "motion/react";

import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";

import {
  HeartPulse,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  LogIn
} from "lucide-react";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await api.get("/users", {
        params: {
          email: form.email.trim().toLowerCase()
        }
      });

      const account = response.data.find(
        (item) => item.password === form.password
      );

      if (!account) {
        toast.error("Invalid email or password.");
        return;
      }

      login(account);

      toast.success(`Welcome, ${account.name}!`);

      navigate(
        location.state?.from?.pathname || "/dashboard",
        { replace: true }
      );
    } catch {
      toast.error("Unable to login. Check JSON Server.");
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: { xs: 3, sm: 5 }
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              bgcolor: "#e0f2fe",
              color: "#176bba",
              width: 75,
              height: 75,
              borderRadius: 4,
              display: "grid",
              placeItems: "center",
              mx: "auto",
              mb: 2
            }}
          >
            <HeartPulse size={40} />
          </Box>

          <Typography variant="h4" fontWeight={800}>
            Welcome Back
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Sign in to your MediCare account.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          <TextField
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={19} />
                  </InputAdornment>
                )
              }
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockKeyhole size={19} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword
                        ? <EyeOff size={19} />
                        : <Eye size={19} />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={
              loading
                ? <CircularProgress size={18} />
                : <LogIn size={19} />
            }
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>

        <Typography textAlign="center" mt={3} fontSize={14}>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </Typography>
      </Card>
    </Box>
  );
}

export default Login;
