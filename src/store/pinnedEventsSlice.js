// src/store/pinnedEventsSlice.js
import { createSlice } from '@reduxjs/toolkit'

const pinnedEventsSlice = createSlice({
  name: 'pinnedEvents',
  initialState: [],
  reducers: {
    pinEvent: (state, action) => {
      const eventId = action.payload
      if (!state.includes(eventId)) {
        state.push(eventId)
      }
    },
    unpinEvent: (state, action) => {
      const eventId = action.payload
      return state.filter((id) => id !== eventId)
    },
  },
})

export const { pinEvent, unpinEvent } = pinnedEventsSlice.actions
export default pinnedEventsSlice.reducer
