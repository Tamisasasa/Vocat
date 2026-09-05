import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import VocabPage from './pages/vocabPage'
import WriteMeow from './pages/writeMeow'
import Summary from './pages/summary'


const App = () => {
  return (
    <BrowserRouter basename="/Vocat">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vocabPage/:id" element={<VocabPage />} />
        <Route path="/write-meow/:id" element={<WriteMeow />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App