import { configureStore } from '@reduxjs/toolkit';
import { loadState, saveState } from './localStorage';

// Import all reducers
import themeReducer from './store/themeSlice';
import accentReducer from './store/accentSlice';
import leagueReducer from './store/leagueSlice';
import favoriteTeamsReducer from './store/favoriteTeamsSlice';
import pinnedEventsReducer from './store/pinnedEventsSlice';
import gamesReducer from './store/gamesSlice';
import fontFamilyReducer from './store/fontFamilySlice';

const preloadedState = loadState();

const store = configureStore({
    reducer: {
        theme: themeReducer,
        accent: accentReducer,
        league: leagueReducer,
        favoriteTeams: favoriteTeamsReducer,
        pinnedEvents: pinnedEventsReducer,
        games: gamesReducer,
        fontFamily: fontFamilyReducer,
    },
    preloadedState, // Load initial state from local storage
});

// Save state to local storage whenever the store updates
store.subscribe(() => {
    saveState(store.getState());
});

export default store;