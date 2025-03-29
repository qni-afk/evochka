import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/ThemeLanguageSwitcher.css';

const ThemeLanguageSwitcher = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const [secretCode, setSecretCode] = useState('');
  const [secretCodeVisible, setSecretCodeVisible] = useState(false);
  const [privateTrackEnabled, setPrivateTrackEnabled] = useState(false);

  // Правильный секретный код
  const correctCode = '7777';

  // Функция для проверки секретного кода
  const checkSecretCode = () => {
    if (secretCode === correctCode) {
      setPrivateTrackEnabled(true);
      // Сохраняем в localStorage, чтобы сохранить состояние между перезагрузками
      localStorage.setItem('privateTrackEnabled', 'true');
      alert('Приватная песня активирована!');
    } else {
      alert('Неверный код!');
    }
    setSecretCode('');
    setSecretCodeVisible(false);
  };

  // Проверяем localStorage при загрузке
  useEffect(() => {
    const savedPrivateTrack = localStorage.getItem('privateTrackEnabled');
    if (savedPrivateTrack === 'true') {
      setPrivateTrackEnabled(true);
    }
  }, []);

  // Показываем tooltip при первом рендере
  useEffect(() => {
    setShowTooltip(true);
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="switchers-container">
      <div className="language-switcher">
        {showTooltip && (
          <div className="language-tooltip">
            {language === 'ru' ? 'Toggle to switch to English' : 'Переключите для русского языка'}
          </div>
        )}
        <button
          className={`language-button ${language === 'ru' ? 'russian' : 'english'}`}
          onClick={toggleLanguage}
          title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flag-ru">
            <span className="flag-icon">🇷🇺</span>
          </div>
          <div className="language-slider"></div>
          <div className="flag-en">
            <span className="flag-icon">🇬🇧</span>
          </div>
        </button>
      </div>

      {/* Секретный код для приватной песни */}
      <div className="secret-code-container">
        {!secretCodeVisible ? (
          <button
            className="secret-code-toggle"
            onClick={() => setSecretCodeVisible(true)}
            title="Введите секретный код"
          >
            🔐
          </button>
        ) : (
          <div className="secret-code-input-container">
            <input
              type="password"
              className="secret-code-input"
              placeholder="Секретный код"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkSecretCode()}
            />
            <button className="secret-code-submit" onClick={checkSecretCode}>✓</button>
            <button className="secret-code-cancel" onClick={() => setSecretCodeVisible(false)}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeLanguageSwitcher;