import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

export default function Carousel({ games, swiperSettings }) {
    
    return (
        <div className='fixed bottom-0 left-0 w-full'>
            {/* The Swiper container */}
            <Swiper {...swiperSettings}>
                {/* Each game is a SwiperSlide */}
                {games.map((game) => (
                    <SwiperSlide key={`${game.league}-${game.external_game_id}`}>
                        <div className="border-2 bg-rosewater border-transparent rounded-lg p-4 mx-2 my-2 text-center">
                            <h2 className="text-xl font-semibold mb-1">{game.league}</h2>
                            <a
                                href={game.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 underline mb-2 block"
                            >
                                ESPN Link
                            </a>
                            <p className="font-medium">
                                {game.away_team_name} ({game.away_team_score})
                                vs.
                                ({game.home_team_score}) {game.home_team_name} 
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Time: {game.short_detail}
                            </p>
                            <p className="text-sm text-gray-600">
                                State: {game.state}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

    )
}
