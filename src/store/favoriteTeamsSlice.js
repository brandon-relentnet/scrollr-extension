// src/store/favoriteTeamsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const favoriteTeamsSlice = createSlice({
    name: 'favoriteTeams',
    initialState: {}, 
    reducers: {
        setFavoriteTeam: (state, action) => {
            const { league, teamId } = action.payload;
            state[league] = teamId;
        },
        removeFavoriteTeam: (state, action) => {
            const { league } = action.payload;
            delete state[league];
        },
    },
});

export const { setFavoriteTeam, removeFavoriteTeam } = favoriteTeamsSlice.actions;
export default favoriteTeamsSlice.reducer;
