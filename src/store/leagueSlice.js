import { createSlice } from '@reduxjs/toolkit';

const leagueSlice = createSlice({
    name: 'league',
    initialState: "", 
    reducers: {
        setLeague: (state, action) => action.payload, 
    },
});

export const { setLeague } = leagueSlice.actions;
export default leagueSlice.reducer;