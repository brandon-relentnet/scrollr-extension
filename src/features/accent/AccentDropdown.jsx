import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAccent } from '../../store/accentSlice';
import Dropdown from '../../components/Dropdown';

const accentOptions = [
    { value: 'rosewater', label: 'Rosewater' },
    { value: 'flamingo', label: 'Flamingo' },
    { value: 'pink', label: 'Pink' },
    { value: 'mauve', label: 'Mauve' },
    { value: 'red', label: 'Red' },
    { value: 'maroon', label: 'Maroon' },
    { value: 'peach', label: 'Peach' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'teal', label: 'Teal' },
    { value: 'sky', label: 'Sky' },
    { value: 'sapphire', label: 'Sapphire' },
    { value: 'blue', label: 'Blue' },
    { value: 'lavender', label: 'Lavender' },
];

function AccentDropdown() {
    const dispatch = useDispatch();
    const currentAccent = useSelector((state) => state.accent);

    const handleAccentSelect = (accent) => {
        dispatch(setAccent(accent));
    };

    return (
        <div className="mb-4">
            <Dropdown
                options={accentOptions.map((option) => ({
                    value: option.value,
                    label: option.label
                }))}
                onSelect={handleAccentSelect}
                label={accentOptions.find((option) => option.value === currentAccent)?.label || 'Select a Accent'}
                selectedValue={currentAccent}
            />
        </div>
    );
}

export default AccentDropdown;