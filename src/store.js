import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './store/themeSlice';
import accentReducer from './store/accentSlice';
import leagueReducer from './store/leagueSlice';
import favoriteTeamsReducer from './store/favoriteTeamsSlice';
import pinnedEventsReducer from './store/pinnedEventsSlice';
import gamesReducer from './store/gamesSlice';
import { loadState, saveState } from './localStorage';

const preloadedState = loadState();

const store = configureStore({
    reducer: {
        theme: themeReducer,
        accent: accentReducer,
        league: leagueReducer,
        favoriteTeams: favoriteTeamsReducer,
        pinnedEvents: pinnedEventsReducer,
        games: gamesReducer,
    },
    preloadedState, // Load initial state from local storage
});

// Save state to local storage whenever the store updates
store.subscribe(() => {
    saveState(store.getState());
});

export default store;