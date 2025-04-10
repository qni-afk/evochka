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

  // Helper function to get translation based on current language
  const getTranslation = (ru, en, vi) => {
    if (language === 'ru') return ru;
    if (language === 'vi') return vi;
    return en; // default to English
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">Eva</div>
        <div className="footer-links">
          <a href="/" className="footer-link">
            {getTranslation('Главная', 'Home', 'Trang chủ')}
          </a>
          <a href="/gallery" className="footer-link">
            {getTranslation('Галерея', 'Gallery', 'Thư viện')}
          </a>
        </div>
        <div className="footer-copyright">
          &copy; {currentYear} {getTranslation('Все права защищены', 'All rights reserved', 'Đã đăng ký Bản quyền')}
        </div>
        <div className="footer-made-with">
          {getTranslation('Сделано Димой', 'Made by Qni', 'Được tạo bởi Dima')} ❤️
        </div>
      </div>
    </footer>
  );
};

export default Footer;