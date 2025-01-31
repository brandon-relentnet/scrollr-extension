import { combineReducers } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import accentReducer from './accentSlice';
import fontFamilyReducer from './fontFamilySlice';
import pinnedEventsReducer from './pinnedEventsSlice';
import leagueReducer from './leagueSlice';
import favoriteTeamsReducer from './favoriteTeamsSlice';
import gamesReducer from './gamesSlice';
import iframeReducer from './iframeSlice';
import carouselReducer from './carouselSlice';
import pinnedTradesReducer from './pinnedTradesSlice';

const rootReducer = combineReducers({
    theme: themeReducer,
    accent: accentReducer,
    fontFamily: fontFamilyReducer,
    pinnedEvents: pinnedEventsReducer,
    league: leagueReducer,
    favoriteTeams: favoriteTeamsReducer,
    games: gamesReducer,
    iframe: iframeReducer,
    carousel: carouselReducer,
    pinnedTrades: pinnedTradesReducer,
});

export default rootReducer;