
import { createSlice } from "@reduxjs/toolkit";

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem("doctorFavorites")) || {};
  } catch {
    return {};
  }
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: loadFavorites(),
  reducers: {
    addFavorite: (state, action) => {
      const { userId, doctor } = action.payload;
      const key = String(userId);

      if (!state[key]) state[key] = [];

      const exists = state[key].some(
        (item) => String(item.id) === String(doctor.id)
      );

      if (!exists) state[key].push(doctor);
    },

    removeFavorite: (state, action) => {
      const { userId, doctorId } = action.payload;
      const key = String(userId);

      state[key] = (state[key] || []).filter(
        (doctor) => String(doctor.id) !== String(doctorId)
      );
    },

    clearFavorites: (state, action) => {
      state[String(action.payload)] = [];
    }
  }
});

export const {
  addFavorite,
  removeFavorite,
  clearFavorites
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
