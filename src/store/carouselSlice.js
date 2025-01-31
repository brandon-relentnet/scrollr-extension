// store/carouselSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    displayType: 'games', // can be 'games' or 'trades'
};

const carouselSlice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {
        setDisplayType(state, action) {
            state.displayType = action.payload;
        },
    },
});

export const { setDisplayType } = carouselSlice.actions;
export default carouselSlice.reducer;
