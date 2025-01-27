// src/store/pinnedEventsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const pinnedEventsSlice = createSlice({
    name: 'pinnedEvents',
    initialState: [],
    reducers: {
        pinEvent: (state, action) => {
            // Add event ID to the list if it's not already pinned
            if (!state.includes(action.payload)) {
                state.push(action.payload);
            }
        },
        unpinEvent: (state, action) => {
            // Remove event ID from the list
            return state.filter(eventId => eventId !== action.payload);
        },
    },
});

export const { pinEvent, unpinEvent } = pinnedEventsSlice.actions;
export default pinnedEventsSlice.reducer;
