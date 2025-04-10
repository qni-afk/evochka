import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './styles/NotFound.css';

function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">{t('notFound', 'title')}</h2>
        <p className="not-found-message">{t('notFound', 'message')}</p>
        <Link to="/" className="back-home-button">
          {t('notFound', 'backButton')}
        </Link>
      </div>
    </div>
  );
}

export default NotFound;