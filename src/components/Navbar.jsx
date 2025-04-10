import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeLanguageSwitcher from './ThemeLanguageSwitcher';
import '../styles/Navbar.css';
import { FiMenu, FiX, FiHome, FiImage, FiCircle, FiUser, FiLogIn, FiLogOut, FiHeadphones } from 'react-icons/fi';

/**
 * Компонент навигации
 */
const Navbar = () => {
  const { t } = useLanguage();
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const defaultAvatar = '/avatar/default-avatar.png'; // Добавлен путь по умолчанию

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Функция для выхода из аккаунта
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          OnlyEva
        </Link>

        {/* Кнопка мобильного меню */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? t('navbar.closeMenu', 'Close Menu') : t('navbar.openMenu', 'Open Menu')}
        >
          {isMobileMenuOpen ? (
            <FiX className="mobile-menu-icon" />
          ) : (
            <FiMenu className="mobile-menu-icon" />
          )}
        </button>

        {/* Десктопное меню */}
        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-items">
            <li className="nav-item">
              <Link
                to="/"
                className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
              >
                <FiHome className="nav-icon" />
                <span>{t('navbar.home', 'Home')}</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/gallery"
                className={location.pathname === '/gallery' ? 'nav-link active' : 'nav-link'}
              >
                <FiImage className="nav-icon" />
                <span>{t('navbar.gallery', 'Gallery')}</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/voice"
                className={location.pathname === '/voice' ? 'nav-link active' : 'nav-link'}
              >
                <FiHeadphones className="nav-icon" />
                <span>{t('navbar.voice', 'Voice')}</span>
              </Link>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  to="/circle"
                  className={location.pathname === '/circle' ? 'nav-link active' : 'nav-link'}
                >
                  <FiCircle className="nav-icon" />
                  <span>{t('navbar.circles', 'Circles')}</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="nav-controls">
            <ThemeLanguageSwitcher />

            {isAuthenticated ? (
              <button onClick={handleLogout} className="auth-button logout-button">
                <FiLogOut className="auth-icon" />
                <span>{t('navbar.logout', 'Logout')}</span>
              </button>
            ) : (
              <Link to="/login" className="auth-button login-button">
                <FiLogIn className="auth-icon" />
                <span>{t('navbar.login', 'Login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;