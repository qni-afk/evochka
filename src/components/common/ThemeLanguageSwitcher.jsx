import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaLanguage } from 'react-icons/fa';
import '../styles/ThemeLanguageSwitcher.css';
import { ThemeContext } from '../contexts/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translator from '../utils/translator';

const ThemeLanguageSwitcher = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { language, toggleLanguage } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
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

  const handleMouseEnter = (text) => {
    setTooltipText(text);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
      setShowTooltip(false);
  };

  // Matrix effect
  const createMatrixEffect = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+=[]{}|;:,.<>?";
    const numChars = 100;

    // Initial burst of characters
    for (let i = 0; i < numChars; i++) {
      setTimeout(() => {
        if (!matrixEnabled) return;
        createMatrixChar(chars);
      }, i * 50);
    }

    // Continue creating characters at intervals
    matrixIntervalRef.current = setInterval(() => {
      if (matrixEnabled) {
        createMatrixChar(chars);
      } else {
        clearInterval(matrixIntervalRef.current);
        matrixIntervalRef.current = null;
      }
    }, 100);
  };

  const createMatrixChar = (chars) => {
    if (!matrixEnabled) return;

    const char = document.createElement('div');
    char.className = 'matrix-char';
    char.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
    char.style.left = `${Math.random() * 100}vw`;
    char.style.animationDuration = `${Math.random() * 3 + 3}s`;
    document.body.appendChild(char);

    setTimeout(() => {
      if (char && char.parentNode) {
        char.remove();
      }
    }, 6000);
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

  const createSnowflake = () => {
    if (!snowEnabled) return;

    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.textContent = '❄';
    flake.style.left = `${Math.random() * 100}vw`;
    flake.style.opacity = Math.random() * 0.7 + 0.3;
    flake.style.fontSize = `${Math.random() * 15 + 10}px`;
    flake.style.animationDuration = `${Math.random() * 5 + 5}s`;

    // Add some sideways movement with CSS variables
    flake.style.setProperty('--move-x', `${(Math.random() - 0.5) * 100}px`);

    document.body.appendChild(flake);

    setTimeout(() => {
      if (flake && flake.parentNode) {
        flake.remove();
      }
    }, 10000);
  };

  // Stars effect
  const createStarsEffect = () => {
    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      // Random size between 2px and 6px
      const size = Math.random() * 4 + 2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // Random position
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;

      // Random animation delay
      star.style.animationDelay = `${Math.random() * 2}s`;

      document.body.appendChild(star);
    }
  };

  // Magic cursor effect
  const enableMagicCursor = () => {
    document.addEventListener('mousemove', handleMagicCursorMove);
  };

  // Rain effect
  const createRainEffect = () => {
    const numDrops = 100;

    // Initial burst of raindrops
    for (let i = 0; i < numDrops; i++) {
      setTimeout(() => {
        if (!rainEnabled) return;
        createRaindrop();
      }, i * 50);
    }

    // Continue creating raindrops at intervals
    rainIntervalRef.current = setInterval(() => {
      if (rainEnabled) {
        createRaindrop();
      } else {
        clearInterval(rainIntervalRef.current);
        rainIntervalRef.current = null;
      }
    }, 100);
  };

  const createRaindrop = () => {
    if (!rainEnabled) return;

    const drop = document.createElement('div');
    drop.className = 'raindrop';

    // Random height between 15px and 30px
    const height = Math.random() * 15 + 15;
    drop.style.height = `${height}px`;

    // Random horizontal position
    drop.style.left = `${Math.random() * 100}vw`;

    // Random animation duration
    drop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;

    document.body.appendChild(drop);

    setTimeout(() => {
      if (drop && drop.parentNode) {
        drop.remove();
      }
    }, 2000);
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

  return (
    <>
      <button
        className="theme-toggle"
        onClick={toggleDarkMode}
        onMouseEnter={() => handleMouseEnter(translator('change_theme', language))}
        onMouseLeave={handleMouseLeave}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <div className="language-container">
        <button
          className="language-toggle"
          onClick={toggleLanguage}
          onMouseEnter={() => handleMouseEnter(translator('change_language', language))}
          onMouseLeave={handleMouseLeave}
        >
          <FaLanguage />
          <span>{language.toUpperCase()}</span>
        </button>
      </div>

      {showTooltip && (
        <div className="tooltip">
          {tooltipText}
        </div>
      )}
    </>
  );
};

export default ThemeLanguageSwitcher;