import React from "react";
import ThemeDropdown from "../features/theme/ThemeDropdown";
import AccentDropdown from "../features/accent/AccentDropdown";

export default function Popup({ league, handleLeagueChange }) {
    return (
        <div className="border-2 bg-slate-700 fixed top-4 right-4 inline-block border-transparent rounded-lg p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Popup Settings</h1>

            <div className="mb-4">
                <label className="mr-2 font-semibold text-accent">Filter by League:</label>
                <select
                    className="border rounded p-1"
                    value={league}
                    onChange={handleLeagueChange}
                >
                    <option value="">All Leagues</option>
                    <option value="NFL">NFL</option>
                    <option value="NBA">NBA</option>
                    <option value="NHL">NHL</option>
                    <option value="MLB">MLB</option>
                </select>
            </div>
            <ThemeDropdown />
            <AccentDropdown />
        </div>
    );
}