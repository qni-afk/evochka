import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Eva from './pages/Eva';
// import Games from './pages/Games';
import ApiStatus from './components/ApiStatus';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';
import './index.css';
import SecretLove from './pages/SecretLove';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeLanguageSwitcher from './components/ThemeLanguageSwitcher';
import Circles from './pages/Circles';
import SecretCodeInput from './components/SecretCodeInput';
import SecretAudio from './components/SecretAudio';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ApiProvider>
            <Router>
              <Navbar />
              <ThemeLanguageSwitcher />
              <ApiStatus />
              <SecretCodeInput />
              <SecretAudio />
              <div className="app-container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/eva" element={<PrivateRoute element={<Eva />} />} />
                  <Route path="/circle" element={<Circles />} />
                  <Route path="/secret-love" element={<SecretLove />} />
                  <Route path="/secret" element={<SecretLove />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </Router>
          </ApiProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
