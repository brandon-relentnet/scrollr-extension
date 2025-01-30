import { createSlice } from '@reduxjs/toolkit';

const iframeSlice = createSlice({
    name: 'iframe',
    initialState: {
        enabled: false
    },
    reducers: {
        toggleIframe: (state) => {
            state.enabled = !state.enabled;
        }
    }
});

export const { toggleIframe } = iframeSlice.actions;
export default iframeSlice.reducer;