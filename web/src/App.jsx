import React from 'react'
import './App.css'
import DesktopLayout from './components/DesktopLayout'
import LessonMap from './components/LessonMap'
import VirtualViewport from './components/VirtualViewport'
import InstructorConsole from './components/InstructorConsole'
import { LessonProvider } from './context/LessonContext'

function App() {
  return (
    <LessonProvider>
      <DesktopLayout
        leftPanel={<LessonMap />}
        centerPanel={<VirtualViewport />}
        bottomPanel={<InstructorConsole />}
      />
    </LessonProvider>
  )
}

export default App
