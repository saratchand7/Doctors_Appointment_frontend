
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Chip
} from "@mui/material";

import {
  HeartPulse,
  Stethoscope,
  CalendarCheck,
  ShieldCheck,
  Clock,
  ArrowRight,
  Brain,
  Baby,
  Bone,
  Eye,
  UserPlus
} from "lucide-react";

const specialties = [
  { name: "Cardiology", icon: HeartPulse },
  { name: "Neurology", icon: Brain },
  { name: "Pediatrics", icon: Baby },
  { name: "Orthopedics", icon: Bone },
  { name: "Eye Care", icon: Eye },
  { name: "General Medicine", icon: Stethoscope }
];

const features = [
  {
    title: "Find Specialists",
    description:
      "Explore doctors by specialization, location and consultation fee.",
    icon: Stethoscope
  },
  {
    title: "Easy Appointments",
    description:
      "Choose your preferred doctor, date and appointment time.",
    icon: CalendarCheck
  },
  {
    title: "Manage Appointments",
    description:
      "Track your bookings and appointment status from your dashboard.",
    icon: ShieldCheck
  }
];

function Home() {
  const { user } = useAuth();

  return (
    <Box>
      <Container maxWidth="xl">

        <Box
          component={motion.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            mt: 3,
            p: { xs: 3, sm: 4, md: 7 },
            borderRadius: 5,
            background:
              "linear-gradient(120deg,#123b60,#176bba,#0891b2)",
            color: "white",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.3fr 1fr"
            },
            alignItems: "center",
            gap: 4
          }}
        >
          <Box>
            <Chip
              label="YOUR HEALTH, OUR PRIORITY"
              icon={<HeartPulse size={17} color="white" />}
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,.15)",
                mb: 3
              }}
            />

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 32, sm: 42, md: 55 },
                fontWeight: 800,
                lineHeight: 1.15
              }}
            >
              Better Healthcare.
              <br />
              Easier Appointments.
            </Typography>

            <Typography
              sx={{
                mt: 3,
                mb: 4,
                fontSize: { xs: 15, md: 18 },
                color: "#e0f2fe",
                maxWidth: 560,
                lineHeight: 1.8
              }}
            >
              Find the right healthcare specialist,
              book appointments and manage your
              healthcare journey with MediCare.
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap"
              }}
            >
              <Button
                component={Link}
                to="/doctors"
                variant="contained"
                endIcon={<ArrowRight size={20} />}
                sx={{
                  bgcolor: "white",
                  color: "#176bba",
                  minHeight: 48,
                  px: 3,
                  "&:hover": {
                    bgcolor: "#e0f2fe"
                  }
                }}
              >
                Find Doctors
              </Button>

              {user?.role === "admin" && (
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  startIcon={<UserPlus size={19} />}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    minHeight: 48,
                    px: 3,
                    "&:hover": {
                      backgroundColor:
                        "rgba(255,255,255,0.1)",
                      borderColor: "white"
                    }
                  }}
                >
                  Create Account
                </Button>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gap: 2
            }}
          >
            {[
              [Stethoscope, "Specialists"],
              [CalendarCheck, "Easy Booking"],
              [HeartPulse, "Patient Care"],
              [Clock, "Appointment Tracking"]
            ].map(([Icon, label]) => (
              <Box
                key={label}
                component={motion.div}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                sx={{
                  p: { xs: 2, md: 3 },
                  minHeight: 145,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,.12)",
                  border:
                    "1px solid rgba(255,255,255,.2)"
                }}
              >
                <Icon size={38} />

                <Typography
                  mt={2}
                  fontWeight={600}
                  fontSize={{ xs: 13, md: 16 }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 6 }}>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight={800}
          >
            Explore Specializations
          </Typography>

          <Typography
            textAlign="center"
            color="text.secondary"
            mt={1}
            mb={4}
          >
            Find the right specialist for your healthcare needs.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2,minmax(0,1fr))",
                sm: "repeat(3,minmax(0,1fr))",
                lg: "repeat(6,minmax(0,1fr))"
              },
              gap: 2
            }}
          >
            {specialties.map(({ name, icon: Icon }) => (
              <Card
                key={name}
                component={motion.div}
                whileHover={{ y: -7 }}
                transition={{ duration: 0.2 }}
                sx={{
                  textAlign: "center",
                  height: "100%",
                  border: "1px solid #e2e8f0"
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      bgcolor: "#e0f2fe",
                      color: "#176bba",
                      borderRadius: 4,
                      display: "grid",
                      placeItems: "center",
                      mx: "auto",
                      mb: 1
                    }}
                  >
                    <Icon size={34} />
                  </Box>

                  <Typography fontWeight={700}>
                    {name}
                  </Typography>

                  <Button
                    component={Link}
                    to="/doctors"
                    size="small"
                    endIcon={<ArrowRight size={15} />}
                    sx={{ mt: "auto" }}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={800}
          mb={1}
        >
          Why Choose MediCare?
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          mb={4}
        >
          A simpler way to manage your healthcare.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3,minmax(0,1fr))"
            },
            gap: 3,
            pb: 6
          }}
        >
          {features.map(
            ({ title, description, icon: Icon }) => (
              <Card
                key={title}
                component={motion.div}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                sx={{
                  height: "100%",
                  border: "1px solid #e2e8f0"
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 65,
                      height: 65,
                      borderRadius: 3,
                      bgcolor: "#e0f2fe",
                      color: "#176bba",
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    <Icon size={32} />
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={2}
                  >
                    {title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    mt={1}
                    lineHeight={1.8}
                  >
                    {description}
                  </Typography>
                </CardContent>
              </Card>
            )
          )}
        </Box>
      </Container>

      <Box
        sx={{
          background: "#123b60",
          color: "white",
          textAlign: "center",
          borderRadius: 3,
          p: 4
        }}
      >
        <HeartPulse size={32} />

        <Typography variant="h6" fontWeight={700}>
          MediCare
        </Typography>

        <Typography fontSize={14} mt={1}>
          Doctor Appointment Management System
        </Typography>

        <Typography
          fontSize={12}
          mt={2}
          color="#bae6fd"
        >
          © {new Date().getFullYear()} MediCare.
          All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;
