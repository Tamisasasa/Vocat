import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import VocabPage from './pages/vocabPage'
import WriteMeow from './pages/writeMeow'

const App = () => {
  return (
    <BrowserRouter basename="/Vocat">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vocabPage/:id" element={<VocabPage />} />
        <Route path="/write-meow/:id" element={<WriteMeow />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App