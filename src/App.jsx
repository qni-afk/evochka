import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Story from './pages/Story';
import Navbar from './components/Navbar';
import './index.css';
import './App.css';
import './styles/Gallery.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/story" element={<Story />} />
          <Route path="/phrases" element={<div className="page-container"><h1>Communication Page Coming Soon</h1></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
