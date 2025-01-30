import { combineReducers } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import accentReducer from './accentSlice';
import fontFamilyReducer from './fontFamilySlice';
import pinnedEventsReducer from './pinnedEventsSlice';
import leagueReducer from './leagueSlice';
import favoriteTeamsReducer from './favoriteTeamsSlice';
import gamesReducer from './gamesSlice';

const rootReducer = combineReducers({
    theme: themeReducer,
    accent: accentReducer,
    fontFamily: fontFamilyReducer,
    pinnedEvents: pinnedEventsReducer,
    league: leagueReducer,
    favoriteTeams: favoriteTeamsReducer,
    games: gamesReducer,
});

export default rootReducer;