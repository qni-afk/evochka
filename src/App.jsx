import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Story from './pages/Story';
import Games from './pages/Games';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import './index.css';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/story" element={<Story />} />
          <Route path="/games" element={<Games />} />
        </Routes>
        <MusicPlayer />
      </div>
    </Router>
  );
}

export default App;
