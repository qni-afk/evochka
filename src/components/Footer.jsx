import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Footer.css';

/**
 * Компонент Footer (подвал сайта)
 * Отображает информацию о сайте и копирайты
 */
const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">Eva</div>
        <div className="footer-links">
          <a href="/" className="footer-link">
            {language === 'ru' ? 'Главная' : 'Home'}
          </a>
          <a href="/gallery" className="footer-link">
            {language === 'ru' ? 'Галерея' : 'Gallery'}
          </a>
        </div>
        <div className="footer-copyright">
          &copy; {currentYear} {language === 'ru' ? 'Все права защищены' : 'All rights reserved'}
        </div>
        <div className="footer-made-with">
          {language === 'ru' ? 'Сделано Димой' : 'Made by Qni'} ❤️
        </div>
      </div>
    </footer>
  );
};

export default Footer;