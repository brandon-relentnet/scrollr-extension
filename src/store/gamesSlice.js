// src/store/gamesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const gamesSlice = createSlice({
    name: 'games',
    initialState: [], // Initialize as an empty array
    reducers: {
        setGames: (state, action) => action.payload, // Replace state with fetched games
    },
});

export const { setGames } = gamesSlice.actions;
export default gamesSlice.reducer;
