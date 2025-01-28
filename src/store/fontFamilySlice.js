import { createSlice } from '@reduxjs/toolkit';

const fontFamilySlice = createSlice({
    name: 'fontFamily',
    initialState: 'Roboto', // Default font family
    reducers: {
        setFontFamily: (state, action) => action.payload, // Set font based on payload
    },
});

export const { setFontFamily } = fontFamilySlice.actions;
export default fontFamilySlice.reducer;