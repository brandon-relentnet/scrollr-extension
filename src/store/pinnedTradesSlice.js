// src/store/pinnedTradesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const pinnedTradesSlice = createSlice({
    name: 'pinnedTrades',
    initialState: [],
    reducers: {
        pinTrade: (state, action) => {
            const symbol = action.payload;
            if (!state.includes(symbol)) {
                state.push(symbol);
            }
        },
        unpinTrade: (state, action) => {
            const symbol = action.payload;
            return state.filter((s) => s !== symbol);
        },
    },
});

export const { pinTrade, unpinTrade } = pinnedTradesSlice.actions;
export default pinnedTradesSlice.reducer;
