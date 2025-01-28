// src/features/counter/FontFamilyDropdown.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFontFamily } from '../../store/fontFamilySlice';
import Dropdown from '../../components/Dropdown';

const fontFamilyOptions = [
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Merriweather', label: 'Merriweather' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Roboto Slab', label: 'Roboto Slab' },
    { value: 'Lora', label: 'Lora' },
    { value: 'Crimson Text', label: 'Crimson Text' },
    { value: 'Pacifico', label: 'Pacifico' },
    { value: 'Great Vibes', label: 'Great Vibes' },
    { value: 'Dancing Script', label: 'Dancing Script' },
    { value: 'Righteous', label: 'Righteous' },
    { value: 'Lobster', label: 'Lobster' },
];

function FontFamilyDropdown() {
    const dispatch = useDispatch();
    const currentFontFamily = useSelector((state) => state.fontFamily);

    const handleFontFamilySelect = (fontFamily) => {
        dispatch(setFontFamily(fontFamily)); // Dispatch the selected font
        console.log('Font Family:', fontFamily);
    };

    return (
        <div className="mb-4">
            <Dropdown
                options={fontFamilyOptions.map((option) => ({
                    value: option.value,
                    label: option.label
                }))}
                onSelect={handleFontFamilySelect}
                label={fontFamilyOptions.find((option) => option.value === currentFontFamily)?.label || 'Select a FontFamily'}
                selectedValue={currentFontFamily}
            />
        </div>
    );
}

export default FontFamilyDropdown;