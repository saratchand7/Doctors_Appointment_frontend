
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-toastify";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider
} from "@mui/material";

import {
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Stethoscope
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.warning("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/users", {
        params: {
          email: email.trim().toLowerCase()
        }
      });

      const account = response.data.find(
        (user) => user.password === password
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

    } catch (error) {
      toast.error("Unable to login. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f2fe, #f0fdfa)",
        py: 5,
        px: 2
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 480,
          p: { xs: 3, sm: 4 },
          borderRadius: 4
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 65,
              height: 65,
              mx: "auto",
              mb: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg,#176bba,#0891b2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
          >
            <HeartPulse size={35} />
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            color="primary"
          >
            Welcome Back
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Sign in to your MediCare account
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            required
            label="Email Address"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} color="#176bba" />
                  </InputAdornment>
                )
              }
            }}
          />

          <TextField
            fullWidth
            required
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color="#176bba" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <LogIn size={20} />
              )
            }
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              fontSize: 16,
              fontWeight: 700,
              textTransform: "none"
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>

        <Typography
          textAlign="center"
          sx={{ mt: 2 }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#176bba",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Register
          </Link>
        </Typography>

        <Divider sx={{ my: 3 }}>
          <Typography
            fontSize={12}
            fontWeight={700}
            color="text.secondary"
          >
            DEMO LOGIN CREDENTIALS
          </Typography>
        </Divider>

        <Box
          sx={{
            bgcolor: "#f0f8fc",
            border: "1px solid #dbeafe",
            borderRadius: 2,
            p: 2,
            mb: 2
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              color: "#176bba"
            }}
          >
            <ShieldCheck size={20} />

            <Typography fontWeight={800}>
              Admin Login
            </Typography>
          </Box>

          <Typography fontSize={14}>
            <strong>Email:</strong> admin@medicare.com
          </Typography>

          <Typography fontSize={14}>
            <strong>Password:</strong> admin123
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "#f0fdfa",
            border: "1px solid #ccfbf1",
            borderRadius: 2,
            p: 2
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              color: "#0891b2"
            }}
          >
            <Stethoscope size={20} />

            <Typography fontWeight={800}>
              Doctor Login
            </Typography>
          </Box>

          <Typography fontSize={14}>
            <strong>Email:</strong> rahul@medicare.com
          </Typography>

          <Typography fontSize={14}>
            <strong>Password:</strong> doctor123
          </Typography>
        </Box>

        <Typography
          textAlign="center"
          color="text.secondary"
          fontSize={11}
          sx={{ mt: 2 }}
        >
          These credentials are for demonstration purposes only.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
