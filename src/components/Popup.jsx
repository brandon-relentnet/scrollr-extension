import React from "react";
import ThemeDropdown from "../features/theme/ThemeDropdown";
import AccentDropdown from "../features/accent/AccentDropdown";
import LeagueDropdown from "../features/league/LeagueDropdown";
import FavoriteTeamDropdown from "../features/teams/FavoriteTeamDropdown";
import FontFamilyDropdown from "../features/font-family/FontFamilyDropdown";

export default function Popup() {
    return (
        <div className="inline-block top-4 right-4 fixed border-2 bg-surface0 p-4 border-transparent rounded-lg text-center text-text">
            <h1 className="mb-4 font-bold text-2xl">Popup Settings</h1>

            <LeagueDropdown />
            <ThemeDropdown />
            <AccentDropdown />
            <FavoriteTeamDropdown />
            <FontFamilyDropdown />
        </div>
    );
}