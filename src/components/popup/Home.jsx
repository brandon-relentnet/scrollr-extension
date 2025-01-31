import React from 'react';
import { useSelector } from 'react-redux';
import LeagueDropdown from '../../features/league/LeagueDropdown';
import FavoriteTeamDropdown from '../../features/teams/FavoriteTeamDropdown';
import CarouselDropdown from '../../features/carousel/CarouselDropdown';

function Home() {
    // Get the current carousel display type from Redux.
    const carouselType = useSelector((state) => state.carousel.displayType);

    return (
        <div>
            <div className="text-center text-text w-96">
                <h2 className="text-2xl text-subtext1 font-semibold m-4 text-left">
                    Preferences
                </h2>
                {/* Centered grid with larger width */}
                <div className="p-4 rounded shadow-lg bg-surface0 gap-8">
                    <label className="ml-1 text-left block mb-2 font-bold">
                        Carousel:
                    </label>
                    <CarouselDropdown />

                    {carouselType === 'games' && (
                        <>
                            <label className="ml-1 text-left block mb-2 font-bold">
                                League:
                            </label>
                            <LeagueDropdown />
                            <label className="ml-1 text-left block mb-2 font-bold">
                                Favorite Team:
                            </label>
                            <FavoriteTeamDropdown />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
