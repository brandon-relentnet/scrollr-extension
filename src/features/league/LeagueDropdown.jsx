import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLeague } from '../../store/leagueSlice';
import Dropdown from '../../components/Dropdown';

const leagueOptions = [
    { value: '', label: 'All' },
    { value: 'NFL', label: 'NFL' },
    { value: 'MLB', label: 'MLB' },
    { value: 'NHL', label: 'NHL' },
    { value: 'NBA', label: 'NBA' },
];

function LeagueDropdown() {
    const dispatch = useDispatch();
    const selectedLeague = useSelector((state) => state.league);

    const handleLeagueSelect = (league) => {
        dispatch(setLeague(league));
    };

    return (
        <div className="mb-4">
            <Dropdown
                options={leagueOptions.map((option) => ({
                    value: option.value,
                    label: option.label
                }))}
                onSelect={handleLeagueSelect}
                label={leagueOptions.find((option) => option.value === selectedLeague)?.label || 'All Leagues'}
                selectedValue={selectedLeague}
            />
        </div>
    );
}

export default LeagueDropdown;