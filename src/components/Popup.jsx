import React from "react";
import ThemeDropdown from "../features/theme/ThemeDropdown";
import AccentDropdown from "../features/accent/AccentDropdown";
import LeagueDropdown from "../features/league/LeagueDropdown";

export default function Popup({ league, handleLeagueChange }) {
    return (
        <div className="border-2 bg-slate-700 fixed top-4 right-4 inline-block border-transparent rounded-lg p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Popup Settings</h1>

            <LeagueDropdown />
            <ThemeDropdown />
            <AccentDropdown />
        </div>
    );
}