import React from 'react'
import './App.css'
import DesktopLayout from './components/DesktopLayout'
import LessonMap from './components/LessonMap'
import VirtualViewport from './components/VirtualViewport'
import InstructorConsole from './components/InstructorConsole'

function App() {
  return (
    <DesktopLayout
      leftPanel={<LessonMap />}
      centerPanel={<VirtualViewport />}
      bottomPanel={<InstructorConsole />}
    />
  )
}

export default App
