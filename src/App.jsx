import React from 'react'
import Carousel from './components/Carousel'
import Popup from './components/Popup'

export default function App() {
  return (
    <div className="h-screen bg-base">
      <Popup />
      <Carousel />
    </div>
  )
}