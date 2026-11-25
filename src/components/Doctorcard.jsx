
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import {
  addFavorite,
  removeFavorite
} from "../features/favoritesSlice";

import DoctorImage from "./DoctorImage";
import { toast } from "react-toastify";
import { motion } from "motion/react";

import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  Rating,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import {
  Heart,
  Hospital,
  MapPin,
  BriefcaseMedical,
  CalendarPlus,
  Eye,
  Pencil,
  Trash2
} from "lucide-react";

const emptyFavorites = [];

function DoctorCard({ doctor, onDelete }) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const favorites = useSelector(
    (state) =>
      state.favorites[String(user?.id)] || emptyFavorites
  );

  const isFavorite = favorites.some(
    (item) => String(item.id) === String(doctor.id)
  );

  function handleFavorite() {
    if (!user || user.role !== "patient") {
      toast.warning("Please login as a patient.");
      return;
    }

    if (isFavorite) {
      dispatch(
        removeFavorite({
          userId: user.id,
          doctorId: doctor.id
        })
      );

      toast.info("Doctor removed from favorites.");
    } else {
      dispatch(
        addFavorite({
          userId: user.id,
          doctor
        })
      );

      toast.success("Doctor added to favorites!");
    }
  }

  return (
    <>
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <DoctorImage doctor={doctor} />

        <Chip
          label={doctor.availability ? "Available" : "Unavailable"}
          color={doctor.availability ? "success" : "error"}
          size="small"
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            fontWeight: 700
          }}
        />

        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            gap: 1.5,
            p: 3
          }}
        >
          <Chip
            label={doctor.specialization}
            size="small"
            sx={{
              alignSelf: "flex-start",
              bgcolor: "#e0f2fe",
              color: "#176bba",
              fontWeight: 700
            }}
          />

          <Typography variant="h6" fontWeight={800}>
            {doctor.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Rating
              value={Number(doctor.rating) || 0}
              precision={0.1}
              size="small"
              readOnly
            />

            <Typography fontSize={13} fontWeight={700}>
              {doctor.rating || "Not rated"}
            </Typography>
          </Box>

          {[
            [Hospital, doctor.hospital],
            [MapPin, doctor.location],
            [BriefcaseMedical, `${doctor.experience} Years Experience`]
          ].map(([Icon, value], index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary"
              }}
            >
              <Icon size={17} color="#176bba" />
              <Typography fontSize={14}>{value}</Typography>
            </Box>
          ))}

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#f0f8fc",
              p: 2,
              borderRadius: 2
            }}
          >
            <Typography fontSize={13}>
              Consultation Fee
            </Typography>

            <Typography
              variant="h6"
              color="primary"
              fontWeight={800}
            >
              ₹{doctor.fee}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: "auto"
            }}
          >
            <Button
              component={Link}
              to={`/doctors/${doctor.id}`}
              variant="outlined"
              startIcon={<Eye size={16} />}
              sx={{ flex: 1, minHeight: 46 }}
            >
              View
            </Button>

            {user?.role === "admin" && (
              <>
                <Button
                  component={Link}
                  to={`/doctors/edit/${doctor.id}`}
                  variant="contained"
                  color="success"
                  startIcon={<Pencil size={15} />}
                  sx={{ flex: 1, minHeight: 46 }}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteOpen(true)}
                  startIcon={<Trash2 size={15} />}
                  sx={{ flex: 1, minHeight: 46 }}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>

          {user?.role === "patient" && (
            <Button
              variant={isFavorite ? "contained" : "outlined"}
              color="error"
              onClick={handleFavorite}
              startIcon={
                <Heart
                  size={18}
                  fill={isFavorite ? "currentColor" : "none"}
                />
              }
            >
              {isFavorite ? "Remove Favorite" : "Add to Favorites"}
            </Button>
          )}

          {(!user || user.role === "patient") && (
            <Button
              component={doctor.availability ? Link : "button"}
              to={
                doctor.availability
                  ? `/appointments/book/${doctor.id}`
                  : undefined
              }
              variant="contained"
              disabled={!doctor.availability}
              startIcon={<CalendarPlus size={18} />}
              fullWidth
            >
              {doctor.availability
                ? "Book Appointment"
                : "Currently Unavailable"}
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      >
        <DialogTitle>Delete Doctor?</DialogTitle>

        <DialogContent>
          Are you sure you want to delete {doctor.name}?
          This action cannot be undone.
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setDeleteOpen(false);
              onDelete?.(doctor.id);
            }}
          >
            Delete Doctor
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DoctorCard;
