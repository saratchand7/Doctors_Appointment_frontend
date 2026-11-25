
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import DoctorCard from "../components/Doctorcard";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

import {
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  InputAdornment,
  Alert
} from "@mui/material";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  UserPlus,
  Stethoscope
} from "lucide-react";

function Doctors() {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [budget, setBudget] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctors() {
      try {
        const response = await api.get("/doctors");
        setDoctors(response.data);
      } catch {
        setError("Unable to load doctors. Check JSON Server.");
      } finally {
        setLoading(false);
      }
    }

    loadDoctors();
  }, []);

  async function handleDelete(id) {
    try {
      await api.delete(`/doctors/${id}`);

      setDoctors((previous) =>
        previous.filter(
          (doctor) => String(doctor.id) !== String(id)
        )
      );

      toast.success("Doctor deleted successfully!");
    } catch {
      toast.error("Unable to delete doctor.");
    }
  }

  const specialties = [
    "All",
    ...new Set(doctors.map((doctor) => doctor.specialization))
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const query = search.toLowerCase().trim();

    const matchesSearch = [
      doctor.name,
      doctor.specialization,
      doctor.hospital,
      doctor.location
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );

    const matchesSpecialty =
      specialization === "All" ||
      doctor.specialization === specialization;

    const fee = Number(doctor.fee);

    const matchesBudget =
      budget === "All" ||
      (budget === "Low" && fee <= 500) ||
      (budget === "Medium" && fee > 500 && fee <= 800) ||
      (budget === "High" && fee > 800);

    const matchesAvailability =
      availability === "All" ||
      (availability === "Available" && doctor.availability) ||
      (availability === "Unavailable" && !doctor.availability);

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesBudget &&
      matchesAvailability
    );
  });

  filteredDoctors.sort((a, b) => {
    switch (sort) {
      case "rating-high":
        return Number(b.rating || 0) - Number(a.rating || 0);

      case "rating-low":
        return Number(a.rating || 0) - Number(b.rating || 0);

      case "fee-low":
        return Number(a.fee) - Number(b.fee);

      case "fee-high":
        return Number(b.fee) - Number(a.fee);

      case "experience":
        return Number(b.experience) - Number(a.experience);

      case "name":
        return a.name.localeCompare(b.name);

      default:
        return 0;
    }
  });

  function resetFilters() {
    setSearch("");
    setSpecialization("All");
    setBudget("All");
    setAvailability("All");
    setSort("default");
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Find Your Doctor
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Explore healthcare specialists and book appointments.
          </Typography>
        </Box>

        {user?.role === "admin" && (
          <Button
            component={Link}
            to="/doctors/add"
            variant="contained"
            startIcon={<UserPlus size={20} />}
          >
            Add Doctor
          </Button>
        )}
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #dce8f2",
          mb: 4
        }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <SlidersHorizontal color="#176bba" />
          <Typography fontWeight={700}>
            Search and Filters
          </Typography>
        </Box>

        <TextField
          placeholder="Search doctor, hospital or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              )
            }
          }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              lg: "repeat(4,1fr)"
            },
            gap: 2,
            mt: 3
          }}
        >
          <TextField
            select
            label="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            {specialties.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Consultation Fee"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <MenuItem value="All">All Prices</MenuItem>
            <MenuItem value="Low">Up to ₹500</MenuItem>
            <MenuItem value="Medium">₹501 - ₹800</MenuItem>
            <MenuItem value="High">Above ₹800</MenuItem>
          </TextField>

          <TextField
            select
            label="Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <MenuItem value="All">All Doctors</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Unavailable">Unavailable</MenuItem>
          </TextField>

          <TextField
            select
            label="Sort By"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="rating-high">Highest Rating</MenuItem>
            <MenuItem value="rating-low">Lowest Rating</MenuItem>
            <MenuItem value="fee-low">Fee: Low to High</MenuItem>
            <MenuItem value="fee-high">Fee: High to Low</MenuItem>
            <MenuItem value="experience">Most Experienced</MenuItem>
            <MenuItem value="name">Name A-Z</MenuItem>
          </TextField>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3
          }}
        >
          <Typography color="text.secondary">
            {filteredDoctors.length} doctors found
          </Typography>

          <Button
            startIcon={<RotateCcw size={18} />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Loading message="Finding healthcare specialists..." />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredDoctors.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Stethoscope size={60} color="#176bba" />

          <Typography variant="h5" mt={2}>
            No doctors found
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Try changing your search or filters.
          </Typography>

          <Button onClick={resetFilters} sx={{ mt: 2 }}>
            Reset Filters
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              lg: "repeat(3,1fr)",
              xl: "repeat(4,1fr)"
            },
            gap: 3
          }}
        >
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}

export default Doctors;
