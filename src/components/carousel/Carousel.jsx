// components/carousels/Carousel.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import GamesCarousel from './GamesCarousel';
import TradesCarousel from './TradesCarousel';
import { Autoplay } from 'swiper/modules';

const breakpointsArray = {};
const startBreakpoint = 0;
const endBreakpoint = 8000;
const breakpointStep = 320;
for (let i = startBreakpoint; i <= endBreakpoint; i += breakpointStep) {
    breakpointsArray[i] = {
        slidesPerView: Math.floor(i / 320),
    };
}

const swiperSettings = {
    modules: [Autoplay],
    autoplay: { delay: 3000, disableOnInteraction: false },
    breakpointsBase: 'container',
    loop: true,
    speed: 600,
    spaceBetween: 8,
    breakpoints: breakpointsArray,
    watchSlidesProgress: true,
};

export default function Carousel() {
    const displayType = useSelector((state) => state.carousel.displayType);

    return (
        <div>
            {displayType === 'games' && <GamesCarousel swiperSettings={swiperSettings} />}
            {displayType === 'trades' && <TradesCarousel swiperSettings={swiperSettings} />}
        </div>
    );
}
