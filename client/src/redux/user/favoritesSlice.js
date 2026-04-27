import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteIds: JSON.parse(localStorage.getItem('wishlist')) || [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter(fid => fid !== id);
      } else {
        state.favoriteIds.push(id);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.favoriteIds));
    },
    clearFavorites: (state) => {
      state.favoriteIds = [];
      localStorage.removeItem('wishlist');
    }
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;