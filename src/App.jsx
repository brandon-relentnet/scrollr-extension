import React from 'react'
import Carousel from './components/Carousel'
import Popup from './components/Popup'

export default function App() {
  return (
    <div className="bg-mantle h-screen">
      <Popup />
      <Carousel />
    </div>
  )
}