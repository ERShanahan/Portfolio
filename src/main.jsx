import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Chess from './pages/Chess.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/papers" element={<div className="text-white p-8">Papers Page Coming Soon</div>} />
        <Route path="/chess" element={<Chess />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
