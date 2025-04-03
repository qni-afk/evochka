import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Login.css';

/**
 * Компонент страницы входа
 * Позволяет пользователю войти с использованием имени пользователя и пароля
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hearts, setHearts] = useState([]);

  const { login, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Если пользователь уже аутентифицирован, перенаправляем на страницу Eva
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/eva');
    }
  }, [isAuthenticated, navigate]);

  // Генерирует плавающее сердечко в случайной позиции
  const generateRandomHeart = () => {
    const heart = {
      id: Date.now() + Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    };

    setHearts((prevHearts) => [...prevHearts, heart]);

    // Удаляем сердце через некоторое время
    setTimeout(() => {
      setHearts((prevHearts) =>
        prevHearts.filter((h) => h.id !== heart.id)
      );
    }, heart.duration * 1000);
  };

  // Генерируем случайные сердечки при первом рендере
  useEffect(() => {
    // Начальные сердечки
    for (let i = 0; i < 10; i++) {
      generateRandomHeart();
    }

    // Интервал генерации новых сердечек
    const interval = setInterval(() => {
      generateRandomHeart();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Проверка полей формы
    if (!username.trim() || !password.trim()) {
      setError(language === 'ru'
        ? 'Пожалуйста, введите имя пользователя и пароль'
        : 'Please enter username and password');
      return;
    }

    try {
      // Попытка входа
      const success = login(username, password);

      if (success) {
        // Если успешно, перенаправляем на страницу Eva
        navigate('/eva');
      } else {
        setError(language === 'ru'
          ? 'Неверное имя пользователя или пароль'
          : 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(language === 'ru'
        ? 'Ошибка при входе. Попробуйте еще раз.'
        : 'Login error. Please try again.');
    }
  };

  return (
    <div className="login-page">
      {/* Плавающие сердечки */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          ❤️
        </div>
      ))}

      <div className="login-container">
        <h1 className="login-title">
          {language === 'ru' ? 'Вход для Евы' : 'Login for Eva'}
        </h1>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              id="username"
              className="login-input"
              placeholder={language === 'ru' ? 'Имя пользователя' : 'Username'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder={language === 'ru' ? 'Пароль' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button">
            {language === 'ru' ? 'Войти' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;