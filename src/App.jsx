import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Eva from './pages/Eva';
import Games from './pages/Games';
import MusicPlayer from './components/MusicPlayer';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';
import SecretLove from './pages/SecretLove';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/eva" element={<Eva />} />
            <Route path="/games" element={<Games />} />
            <Route path="/secret-love" element={<SecretLove />} />
          </Routes>
        </div>
        <MusicPlayer />
      </Router>
    </LanguageProvider>
  );
}

export default App;
