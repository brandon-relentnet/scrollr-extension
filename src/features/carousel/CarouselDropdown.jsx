// CarouselDropdown.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDisplayType } from '../../store/carouselSlice';
import Dropdown from '../../components/Dropdown';

const carouselOptions = [
    { value: 'games', label: 'Games' },
    { value: 'trades', label: 'Trades' },
];

function CarouselDropdown() {
    const dispatch = useDispatch();
    const displayType = useSelector((state) => state.carousel.displayType);

    const handleSelect = (value) => {
        dispatch(setDisplayType(value));
    };

    return (
        <div className="mb-4">
            <Dropdown
                options={carouselOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                }))}
                onSelect={handleSelect}
                label={
                    carouselOptions.find(
                        (option) => option.value === displayType
                    )?.label || 'Select Carousel'
                }
                selectedValue={displayType}
            />
        </div>
    );
}

export default CarouselDropdown;
