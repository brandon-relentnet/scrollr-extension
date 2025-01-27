import { createSlice } from '@reduxjs/toolkit';

const accentSlice = createSlice({
    name: 'accenter',
    initialState: 'pink', // Default theme
    reducers: {
        setAccent: (state, action) => action.payload, // Set theme based on payload
    },
});

export const { setAccent } = accentSlice.actions;
export default accentSlice.reducer;