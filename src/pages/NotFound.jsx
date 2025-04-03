import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles/NotFound.css';

/**
 * Компонент страницы "Не найдено" (404)
 * Отображается, когда пользователь переходит по несуществующему URL
 */
const NotFound = () => {
  const { language } = useLanguage();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">
          {language === 'ru'
            ? 'Страница не найдена'
            : 'Page not found'}
        </p>
        <p className="not-found-description">
          {language === 'ru'
            ? 'Похоже, что страница, которую вы ищете, не существует или была перемещена.'
            : 'The page you are looking for doesn\'t exist or has been moved.'}
        </p>
        <Link to="/" className="not-found-button">
          {language === 'ru' ? 'Вернуться на главную' : 'Return to home page'}
        </Link>
      </div>
      <div className="hearts-container">
        {Array(10).fill().map((_, i) => (
          <div
            key={`heart-${i}-${Math.random()}`}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${Math.random() * 30 + 10}px`
            }}
          >
            ❤️
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;