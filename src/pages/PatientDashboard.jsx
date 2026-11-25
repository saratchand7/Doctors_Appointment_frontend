
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { motion } from "motion/react";
import { toast } from "react-toastify";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Skeleton,
  Divider,
  Alert
} from "@mui/material";

import {
  Stethoscope,
  CalendarDays,
  CalendarCheck,
  CalendarPlus,
  Heart,
  HeartPulse,
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

function PatientDashboard() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const favoritesCount = useSelector(
    (state) =>
      state.favorites[String(user?.id)]?.length || 0
  );

  useEffect(() => {
    let active = true;

    async function loadAppointments() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/appointments");

        const patientAppointments = response.data.filter(
          (item) =>
            String(item.patientId) === String(user.id)
        );

        if (active) {
          setAppointments(patientAppointments);
        }
      } catch {
        if (active) {
          setError("Unable to load your appointments.");
          toast.error("Unable to load appointments.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAppointments();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const pending = appointments.filter(
    (item) => item.status === "Pending"
  ).length;

  const confirmed = appointments.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const completed = appointments.filter(
    (item) => item.status === "Completed"
  ).length;

  const statistics = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: CalendarDays,
      color: "#176bba",
      background: "#e0f2fe"
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "#d97706",
      background: "#fef3c7"
    },
    {
      title: "Confirmed",
      value: confirmed,
      icon: CalendarCheck,
      color: "#16a34a",
      background: "#dcfce7"
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "#0891b2",
      background: "#cffafe"
    },
    {
      title: "Favorite Doctors",
      value: favoritesCount,
      icon: Heart,
      color: "#dc2626",
      background: "#fee2e2"
    }
  ];

  const quickActions = [
    {
      title: "Find Doctors",
      description:
        "Explore healthcare specialists and book appointments.",
      icon: Stethoscope,
      path: "/doctors",
      color: "#176bba",
      background: "#e0f2fe",
      button: "Explore Doctors"
    },
    {
      title: "My Appointments",
      description:
        "View, track and manage your healthcare appointments.",
      icon: CalendarDays,
      path: "/my-appointments",
      color: "#0891b2",
      background: "#cffafe",
      button: "View Appointments"
    },
    {
      title: "Favorite Doctors",
      description:
        "Quickly access your saved healthcare specialists.",
      icon: Heart,
      path: "/favorites",
      color: "#dc2626",
      background: "#fee2e2",
      button: "View Favorites"
    }
  ];

  const recentAppointments = [...appointments]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.date || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.date || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 3);

  function getStatusColor(status) {
    switch (status) {
      case "Confirmed":
        return "success";
      case "Completed":
        return "info";
      case "Pending":
        return "warning";
      case "Cancelled":
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3, md: 5 }
      }}
    >
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 5,
          p: { xs: 3, sm: 4, md: 5 },
          mb: 5,
          minHeight: 230,
          color: "white",
          background:
            "linear-gradient(120deg,#123b60,#176bba,#0891b2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            fontSize={12}
            fontWeight={700}
            letterSpacing={3}
            color="#bae6fd"
            mb={2}
          >
            PATIENT PORTAL
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 28, md: 40 },
              fontWeight: 800
            }}
          >
            Welcome back, {user?.name || "Patient"}!
          </Typography>

          <Typography
            sx={{
              color: "#e0f2fe",
              mt: 2,
              mb: 3,
              maxWidth: 550,
              lineHeight: 1.7
            }}
          >
            Manage your healthcare appointments,
            discover specialists and access your
            favorite doctors from one place.
          </Typography>

          <Button
            component={Link}
            to="/doctors"
            variant="contained"
            startIcon={<CalendarPlus size={20} />}
            sx={{
              bgcolor: "white",
              color: "#176bba",
              "&:hover": {
                bgcolor: "#e0f2fe"
              }
            }}
          >
            Book Appointment
          </Button>
        </Box>

        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            display: { xs: "none", md: "grid" },
            placeItems: "center",
            width: 170,
            height: 170,
            flexShrink: 0,
            borderRadius: "50%",
            background: "rgba(255,255,255,.12)",
            border: "1px solid rgba(255,255,255,.2)"
          }}
        >
          <HeartPulse size={90} strokeWidth={1.5} />
        </Box>
      </Box>

      <Typography
        variant="h5"
        fontWeight={800}
        mb={1}
      >
        Healthcare Overview
      </Typography>

      <Typography
        color="text.secondary"
        mb={3}
      >
        A quick summary of your healthcare activity.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,minmax(0,1fr))",
            md: "repeat(3,minmax(0,1fr))",
            lg: "repeat(5,minmax(0,1fr))"
          },
          gap: 2.5,
          mb: 5
        }}
      >
        {statistics.map((item, index) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              component={motion.div}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ y: -4 }}
              sx={{
                border: "1px solid #e2e8f0",
                height: "100%"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: item.background,
                    color: item.color,
                    display: "grid",
                    placeItems: "center",
                    mb: 2
                  }}
                >
                  <Icon size={24} />
                </Box>

                {loading && item.title !== "Favorite Doctors" ? (
                  <Skeleton width={45} height={45} />
                ) : (
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color={item.color}
                  >
                    {error && item.title !== "Favorite Doctors"
                      ? "—"
                      : item.value}
                  </Typography>
                )}

                <Typography
                  fontSize={13}
                  fontWeight={600}
                  color="text.secondary"
                  mt={1}
                >
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Typography
        variant="h5"
        fontWeight={800}
        mb={1}
      >
        Quick Actions
      </Typography>

      <Typography
        color="text.secondary"
        mb={3}
      >
        Everything you need, in one place.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3,minmax(0,1fr))"
          },
          gap: 3,
          mb: 5
        }}
      >
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              component={motion.div}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              sx={{
                height: "100%",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start"
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: item.background,
                    color: item.color,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    mb: 2.5
                  }}
                >
                  <Icon size={30} />
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={800}
                  mb={1}
                >
                  {item.title}
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={14}
                  lineHeight={1.8}
                  mb={3}
                >
                  {item.description}
                </Typography>

                <Button
                  component={Link}
                  to={item.path}
                  endIcon={<ArrowRight size={17} />}
                  sx={{
                    mt: "auto",
                    color: item.color,
                    px: 0
                  }}
                >
                  {item.button}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Card
        sx={{
          border: "1px solid #e2e8f0",
          mb: 3
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 3
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
              >
                Recent Appointments
              </Typography>

              <Typography
                color="text.secondary"
                fontSize={14}
                mt={1}
              >
                Track your latest healthcare bookings.
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/my-appointments"
              endIcon={<ArrowRight size={18} />}
            >
              View All
            </Button>
          </Box>

          <Divider />

          {loading ? (
            <Stack spacing={2} mt={3}>
              <Skeleton height={65} />
              <Skeleton height={65} />
              <Skeleton height={65} />
            </Stack>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 3 }}>
              Appointment information is unavailable.
            </Alert>
          ) : recentAppointments.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 5
              }}
            >
              <CalendarDays
                size={55}
                color="#94a3b8"
                strokeWidth={1.5}
              />

              <Typography
                variant="h6"
                fontWeight={700}
                mt={2}
              >
                No appointments yet
              </Typography>

              <Typography
                color="text.secondary"
                mt={1}
                mb={3}
              >
                Book your first appointment with a specialist.
              </Typography>

              <Button
                component={Link}
                to="/doctors"
                variant="contained"
                startIcon={<CalendarPlus size={18} />}
              >
                Find a Doctor
              </Button>
            </Box>
          ) : (
            <Stack spacing={2} mt={3}>
              {recentAppointments.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    p: 2,
                    border: "1px solid #e2e8f0",
                    borderRadius: 3,
                    bgcolor: "#f8fafc"
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        bgcolor: "#e0f2fe",
                        color: "#176bba",
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center"
                      }}
                    >
                      <Stethoscope size={24} />
                    </Box>

                    <Box>
                      <Typography fontWeight={700}>
                        {item.doctorName || "Doctor"}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        fontSize={13}
                        mt={0.5}
                      >
                        {item.date} · {item.time}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default PatientDashboard;
