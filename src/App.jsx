import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery/index';
import Eva from './pages/Eva/index';
import Voice from './pages/Voice/index';
import ApiStatus from './components/ApiStatus';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';
import './index.css';
import SecretLove from './pages/SecretLove/index';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login/index';
import Register from './pages/Register/index';
import NotFound from './pages/NotFound/index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeLanguageSwitcher from './components/ThemeLanguageSwitcher';
import Circles from './pages/Circles/index';
import SecretCodeInput from './components/SecretCodeInput';
import SecretAudio from './components/SecretAudio';

// Компонент для внутреннего содержимого App
const AppContent = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className="app-container">
      <div className={`app-content ${darkMode ? 'dark-mode' : ''}`}>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            {/* Маршрут к Eva скрыт/закомментирован
            <Route path="/eva" element={
              <PrivateRoute>
                <Eva />
              </PrivateRoute>
            } />
            */}
            <Route path="/voice" element={<Voice />} />
            <Route path="/circle" element={
              <PrivateRoute>
                <Circles />
              </PrivateRoute>
            } />
            <Route path="/circles" element={
              <PrivateRoute>
                <Circles />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/secret" element={
              <PrivateRoute>
                <SecretLove />
              </PrivateRoute>
            } />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
        <Footer />
        <SecretCodeInput />
        <SecretAudio />
        <ApiStatus />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ApiProvider>
              <AppContent />
            </ApiProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
