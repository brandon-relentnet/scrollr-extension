import { createSlice } from '@reduxjs/toolkit';

const leagueSlice = createSlice({
    name: 'league',
    initialState: 'all', // Default theme
    reducers: {
        setLeague: (state, action) => action.payload, // Set theme based on payload
    },
});

export const { setLeague } = leagueSlice.actions;
export default leagueSlice.reducer;