// src/features/teams/FavoriteTeamDropdown.jsx
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFavoriteTeam, removeFavoriteTeam } from '../../store/favoriteTeamsSlice';
import { pinEvent, unpinEvent } from '../../store/pinnedEventsSlice';
import Dropdown from '../../components/Dropdown';

const FavoriteTeamDropdown = ({ events }) => {
    const dispatch = useDispatch();
    const selectedLeague = useSelector((state) => state.league);
    const favoriteTeams = useSelector((state) => state.favoriteTeams);
    const favoriteTeam = favoriteTeams[selectedLeague] || '';

    // Extract unique teams from events
    const teamOptions = useMemo(() => {
        if (!events) return [];
        const teamsMap = new Map();
        events.forEach(event => {
            event.competitions.forEach(competition => {
                competition.competitors.forEach(competitor => {
                    teamsMap.set(competitor.team.id, competitor.team.displayName);
                });
            });
        });
        const options = Array.from(teamsMap, ([id, name]) => ({ value: id, label: name }));
        return options.sort((a, b) => a.label.localeCompare(b.label)); // Optional: Sort alphabetically
    }, [events]);

    // Helper function to get event IDs related to a specific team
    const getEventsByTeam = (teamId) => {
        return events
            .filter(event =>
                event.competitions.some(competition =>
                    competition.competitors.some(competitor => competitor.team.id === teamId)
                )
            )
            .map(event => event.id);
    };

    const handleTeamSelect = (teamId) => {
        if (teamId === favoriteTeam) {
            // User is deselecting the favorite team
            dispatch(removeFavoriteTeam({ league: selectedLeague }));

            // Unpin all events related to the favorite team
            const eventsToUnpin = getEventsByTeam(teamId);
            eventsToUnpin.forEach(eventId => dispatch(unpinEvent(eventId)));
        } else {
            // If changing favorite team, first unpin previous favorite team events
            if (favoriteTeam) {
                const previousFavoriteEvents = getEventsByTeam(favoriteTeam);
                previousFavoriteEvents.forEach(eventId => dispatch(unpinEvent(eventId)));
            }

            // Set the new favorite team
            dispatch(setFavoriteTeam({ league: selectedLeague, teamId }));

            // Pin all events related to the new favorite team
            const eventsToPin = getEventsByTeam(teamId);
            eventsToPin.forEach(eventId => dispatch(pinEvent(eventId)));
        }
    };

    if (!selectedLeague) {
        return <p>Please select a league to choose a favorite team.</p>;
    }

    if (teamOptions.length === 0) {
        return <p>No teams available for the selected league.</p>;
    }

    return (
        <div className="mb-4">
            <Dropdown
                options={teamOptions.map((option) => ({ 
                    value: option.value, 
                    label: option.label 
                }))}
                onSelect={handleTeamSelect}
                label={teamOptions.find((option) => option.value === favoriteTeam)?.label || 'Select a Team'}
                selectedValue={favoriteTeam}
            />
        </div>
    );
};

export default FavoriteTeamDropdown;
