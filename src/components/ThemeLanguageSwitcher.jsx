import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaLanguage } from 'react-icons/fa';
import '../styles/ThemeLanguageSwitcher.css';
import { ThemeContext } from '../contexts/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translator from '../utils/translator';

const ThemeLanguageSwitcher = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { language, toggleLanguage, setSpecificLanguage, availableLanguages } = useLanguage();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  // New states for special effects
  const [matrixEnabled, setMatrixEnabled] = useState(false);
  const [snowEnabled, setSnowEnabled] = useState(false);
  const [starsEnabled, setStarsEnabled] = useState(false);
  const [magicCursorEnabled, setMagicCursorEnabled] = useState(false);
  const [rainEnabled, setRainEnabled] = useState(false);

  // Refs for intervals
  const snowIntervalRef = useRef(null);
  const rainIntervalRef = useRef(null);
  const matrixIntervalRef = useRef(null);

  // Function to handle magic cursor movements
  const handleMagicCursorMove = (event) => {
    if (!magicCursorEnabled) return;

    const particle = document.createElement('div');
    particle.className = 'magic-particle';

    // Random color
    const hue = Math.random() * 360;
    particle.style.background = `hsl(${hue}, 100%, 70%)`;

    // Position at cursor
    particle.style.left = `${event.clientX}px`;
    particle.style.top = `${event.clientY}px`;

    // Random direction variables
    particle.style.setProperty('--rand-x', Math.random());
    particle.style.setProperty('--rand-y', Math.random());

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  };

  // Function to clear all effects
  const clearAllEffects = () => {
    // Stop music if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Clear Matrix effect
    if (matrixEnabled) {
      const matrixChars = document.querySelectorAll('.matrix-char');
      matrixChars.forEach(char => char.remove());
      setMatrixEnabled(false);
      if (matrixIntervalRef.current) {
        clearInterval(matrixIntervalRef.current);
        matrixIntervalRef.current = null;
      }
    }

    // Clear Snow effect
    if (snowEnabled) {
      const snowflakes = document.querySelectorAll('.snowflake');
      snowflakes.forEach(flake => flake.remove());
      setSnowEnabled(false);
      if (snowIntervalRef.current) {
        clearInterval(snowIntervalRef.current);
        snowIntervalRef.current = null;
      }
    }

    // Clear Stars effect
    if (starsEnabled) {
      const stars = document.querySelectorAll('.star');
      stars.forEach(star => star.remove());
      setStarsEnabled(false);
    }

    // Clear Magic Cursor effect
    if (magicCursorEnabled) {
      document.removeEventListener('mousemove', handleMagicCursorMove);
      const particles = document.querySelectorAll('.magic-particle');
      particles.forEach(particle => particle.remove());
      setMagicCursorEnabled(false);
    }

    // Clear Rain effect
    if (rainEnabled) {
      const raindrops = document.querySelectorAll('.raindrop');
      raindrops.forEach(drop => drop.remove());
      setRainEnabled(false);
      if (rainIntervalRef.current) {
        clearInterval(rainIntervalRef.current);
        rainIntervalRef.current = null;
      }
    }
  };

  // Snow effect
  const createSnowEffect = () => {
    const numFlakes = 50;

    // Initial burst of snowflakes
    for (let i = 0; i < numFlakes; i++) {
      setTimeout(() => {
        if (!snowEnabled) return;
        createSnowflake();
      }, i * 100);
    }

    // Continue creating snowflakes at intervals
    snowIntervalRef.current = setInterval(() => {
      if (snowEnabled) {
        createSnowflake();
      } else {
        clearInterval(snowIntervalRef.current);
        snowIntervalRef.current = null;
      }
    }, 300);
  };

  // Cleanup effects when component unmounts
  useEffect(() => {
    return () => {
      clearAllEffects();
      if (snowIntervalRef.current) clearInterval(snowIntervalRef.current);
      if (rainIntervalRef.current) clearInterval(rainIntervalRef.current);
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
    };
  }, []);

  const handleLanguageIconClick = () => {
    if (availableLanguages.length <= 2) {
      // Если у нас только 2 языка, просто переключаемся между ними
      toggleLanguage();
    } else {
      // Если у нас больше 2 языков, показываем селектор
      setShowLanguageSelector(!showLanguageSelector);
    }
  };

  const selectLanguage = (lang) => {
    setSpecificLanguage(lang);
    setShowLanguageSelector(false);
  };

  const getLanguageText = () => {
    switch (language) {
      case 'ru':
        return 'RU';
      case 'en':
        return 'EN';
      case 'vi':
        return 'VI';
      default:
        return language.toUpperCase();
    }
  };

  const getFlagEmoji = () => {
    switch (language) {
      case 'ru':
        return '🇷🇺';
      case 'en':
        return '🇺🇸';
      case 'vi':
        return '🇻🇳';
      default:
        return <FaLanguage />;
    }
  };

  return (
    <div className="theme-language-switcher">
      {/* Theme toggle */}
      <button
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {darkMode ? <FaSun className="icon sun-icon" /> : <FaMoon className="icon moon-icon" />}
      </button>

      {/* Language toggle */}
      <div className="language-control">
        <button
          className="language-toggle"
          onClick={handleLanguageIconClick}
          aria-label="Change language"
        >
          <span className="lang-flag">{getFlagEmoji()}</span>
          <span className="lang-text">{getLanguageText()}</span>
        </button>

        {showLanguageSelector && (
          <div className="language-selector">
            {availableLanguages.map(lang => (
              <button
                key={lang}
                className={`language-option ${language === lang ? 'active' : ''}`}
                onClick={() => selectLanguage(lang)}
              >
                {lang === 'ru' && '🇷🇺 Русский'}
                {lang === 'en' && '🇺🇸 English'}
                {lang === 'vi' && '🇻🇳 Tiếng Việt'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeLanguageSwitcher;