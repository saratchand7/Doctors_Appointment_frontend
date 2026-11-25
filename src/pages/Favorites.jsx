
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { clearFavorites } from "../features/favoritesSlice";
import DoctorCard from "../components/Doctorcard";
import EmptyState from "../components/EmptyState";

import { toast } from "react-toastify";

import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import { Heart, Trash2 } from "lucide-react";

const emptyFavorites = [];

function Favorites() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const favorites = useSelector(
    (state) =>
      state.favorites[String(user?.id)] || emptyFavorites
  );

  function handleClear() {
    dispatch(clearFavorites(user.id));
    setOpen(false);
    toast.success("Favorites cleared.");
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 4
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Heart color="#ef4444" />
            My Favorites
          </Typography>

          <Typography color="text.secondary" mt={1}>
            {favorites.length} saved doctors
          </Typography>
        </Box>

        {favorites.length > 0 && (
          <Button
            color="error"
            variant="outlined"
            startIcon={<Trash2 size={18} />}
            onClick={() => setOpen(true)}
          >
            Clear Favorites
          </Button>
        )}
      </Box>

      {favorites.length === 0 ? (
        <EmptyState
          title="No favorite doctors yet"
          message="Save your preferred doctors for easy access."
          buttonText="Explore Doctors"
          path="/doctors"
          Icon={Heart}
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              lg: "repeat(3,1fr)"
            },
            gap: 3
          }}
        >
          {favorites.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Clear all favorites?</DialogTitle>

        <DialogContent>
          All saved doctors will be removed from your favorites.
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleClear}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Favorites;
