import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

/**
 * Компонент навигации
 */
const Navbar = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Evochka
        </Link>

        {/* Мобильное меню */}
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        {/* Навигационные ссылки */}
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
              {language === 'ru' ? 'Главная' : 'Home'}
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/gallery" className={location.pathname === '/gallery' ? 'nav-link active' : 'nav-link'}>
              {language === 'ru' ? 'Галерея' : 'Gallery'}
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/circle" className={location.pathname === '/circle' ? 'nav-link active' : 'nav-link'}>
              {language === 'ru' ? 'Кружочки' : 'Circles'}
            </Link>
          </li>

          {/* Ссылка на профиль - видна только для авторизованных */}
          {isAuthenticated && (
            <li className="nav-item">
              <Link to="/eva" className={location.pathname === '/eva' ? 'nav-link active' : 'nav-link'}>
                {language === 'ru' ? 'Профиль' : 'Profile'}
              </Link>
            </li>
          )}

          {/* Ссылка на вход/выход */}
          <li className="nav-item login-item">
            {isAuthenticated ? (
              <Link to="/eva" className="nav-link login-link">
                {language === 'ru' ? 'Мой профиль' : 'My Profile'}
              </Link>
            ) : (
              <Link to="/login" className="nav-link login-link">
                {language === 'ru' ? 'Вход' : 'Login'}
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;