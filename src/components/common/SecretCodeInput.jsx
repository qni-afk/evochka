import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles/SecretCodeInput.css';

const SecretCodeInput = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const codeInputRef = useRef(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Список секретных кодов и соответствующих им страниц
  const secretCodes = {
    // Навигация
    'музыка для кода 333': '/secret-love',
    '333': '/secret-love',
    '143': '/secret-love',
    'circle': '/circle',
    'admin': '/login',
    'gallery': '/gallery',
    'home': '/',
    'login': '/login',

    // Специальные команды
    'music': () => {
      // Включаем музыку
      window.dispatchEvent(
        new CustomEvent('toggleMusic', { detail: { play: true } })
      );
      return true;
    },
    'music:off': () => {
      // Выключаем музыку
      window.dispatchEvent(
        new CustomEvent('toggleMusic', { detail: { play: false } })
      );
      return true;
    },
    'theme:pink': () => {
      document.documentElement.style.setProperty('--primary-color', '#ff6b9c');
      document.documentElement.style.setProperty('--secondary-color', '#ff9cad');
      document.documentElement.style.setProperty('--light-color', '#fff0f6');
      document.documentElement.style.setProperty('--accent-color', '#ffcd3c');
      document.body.className = 'theme-pink';
      return true;
    },
    'theme:purple': () => {
      document.documentElement.style.setProperty('--primary-color', '#9c55ff');
      document.documentElement.style.setProperty('--secondary-color', '#c28aff');
      document.documentElement.style.setProperty('--light-color', '#f5f0ff');
      document.documentElement.style.setProperty('--accent-color', '#ffcd3c');
      document.body.className = 'theme-purple';
      return true;
    },
    'theme:blue': () => {
      document.documentElement.style.setProperty('--primary-color', '#5271ff');
      document.documentElement.style.setProperty('--secondary-color', '#7892ff');
      document.documentElement.style.setProperty('--light-color', '#f0f4ff');
      document.documentElement.style.setProperty('--accent-color', '#ffcd3c');
      document.body.className = 'theme-blue';
      return true;
    },
    'theme:teal': () => {
      document.documentElement.style.setProperty('--primary-color', '#00c9a7');
      document.documentElement.style.setProperty('--secondary-color', '#4adec9');
      document.documentElement.style.setProperty('--light-color', '#e6fff8');
      document.documentElement.style.setProperty('--accent-color', '#ffa64d');
      document.body.className = 'theme-teal';
      return true;
    },
    'lang:ru': () => {
      localStorage.setItem('language', 'ru');
      window.location.reload();
      return true;
    },
    'lang:en': () => {
      localStorage.setItem('language', 'en');
      window.location.reload();
      return true;
    },
    'logout': () => {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return true;
    },
    'clear': () => {
      localStorage.clear();
      window.location.reload();
      return true;
    },
    // Пасхалки и скрытые функции
    'help': () => {
      setShowHint(true);
      return false; // Не закрываем окно
    },
    'hint': () => {
      setShowHint(true);
      return false; // Не закрываем окно
    },
    'credits': () => {
      alert('Made with ❤️ by Claude');
      return true;
    }
  };

  // Обработчик нажатия клавиш для открытия секретного поля по правому Alt
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Проверяем, что нажата клавиша правый Alt (AltRight)
      if (e.code === 'AltRight') {
        setShowCodeInput(true);
        setErrorMessage('');
        setShowHint(false);
        setTimeout(() => {
          if (codeInputRef.current) {
            codeInputRef.current.focus();
          }
        }, 100);
      }

      // Закрываем окно по Escape
      if (e.key === 'Escape') {
        setShowCodeInput(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Обработчик ввода секретного кода
  const handleSecretSubmit = (e) => {
    e.preventDefault();

    // Проверяем, есть ли введенный код в списке секретных кодов
    const enteredCode = e.target.secretInput.value.trim();

    if (secretCodes[enteredCode]) {
      // Проверяем, является ли значение функцией
      if (typeof secretCodes[enteredCode] === 'function') {
        // Если это функция, вызываем её
        const result = secretCodes[enteredCode]();
        if (result) {
          setShowCodeInput(false);
        }
      } else {
        // Проверяем, является ли код одним из кодов для секретной страницы
        if (enteredCode === '333' || enteredCode === '143' || enteredCode === 'музыка для кода 333') {
          // Устанавливаем флаг доступа к секретной странице
          localStorage.setItem('secretMessageVisible', 'true');
          console.log('Установлен флаг secretMessageVisible для доступа к секретной странице');
        }

        // Если код найден, перенаправляем на соответствующую страницу
        navigate(secretCodes[enteredCode]);
        setShowCodeInput(false);
      }
    } else {
      // Если код неверный, показываем сообщение об ошибке
      setErrorMessage(language === 'ru' ? 'Неверный код. Попробуйте еще раз.' : 'Invalid code. Try again.');
      // Очищаем поле ввода
      setSecretCode('');
    }
  };

  // Закрытие секретного поля ввода
  const handleCloseSecretInput = () => {
    setShowCodeInput(false);
    setErrorMessage('');
    setShowHint(false);
  };

  // Показ подсказки по командам
  const getHints = () => {
    return (
      <div className="secret-code-hints">
        <h4>{language === 'ru' ? 'Доступные команды' : 'Available commands'}</h4>
        <ul>
          <li><strong>circle</strong> - {language === 'ru' ? 'Переход на страницу кружочков' : 'Go to circles page'}</li>
          <li><strong>gallery</strong> - {language === 'ru' ? 'Переход в галерею' : 'Go to gallery'}</li>
          <li><strong>333</strong> - {language === 'ru' ? 'Секретная страница' : 'Secret page'}</li>
          <li><strong>143</strong> - {language === 'ru' ? 'Секретная страница любви' : 'Secret love page'}</li>
          <li><strong>music</strong> - {language === 'ru' ? 'Включить секретную музыку' : 'Play secret music'}</li>
          <li><strong>music:off</strong> - {language === 'ru' ? 'Выключить музыку' : 'Stop music'}</li>
          <li><strong>theme:pink</strong>, <strong>theme:blue</strong>, <strong>theme:purple</strong>, <strong>theme:teal</strong> - {language === 'ru' ? 'Изменение темы' : 'Change theme'}</li>
          <li><strong>lang:ru</strong>, <strong>lang:en</strong> - {language === 'ru' ? 'Изменение языка' : 'Change language'}</li>
          <li><strong>logout</strong> - {language === 'ru' ? 'Выход из аккаунта' : 'Logout'}</li>
          <li><strong>clear</strong> - {language === 'ru' ? 'Очистка локального хранилища' : 'Clear local storage'}</li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {showCodeInput && (
        <div className="secret-code-overlay">
          <div className="secret-code-container">
            <button className="close-secret-btn" onClick={handleCloseSecretInput}>×</button>
            <h3>{language === 'ru' ? 'Введите секретный код' : 'Enter secret code'}</h3>
            <form onSubmit={handleSecretSubmit}>
              <input
                type="text"
                name="secretInput"
                ref={codeInputRef}
                className="secret-code-input"
                placeholder={language === 'ru' ? 'Секретный код...' : 'Secret code...'}
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                autoFocus
              />
            </form>

            {errorMessage && (
              <div className="secret-code-error">
                {errorMessage}
              </div>
            )}

            {showHint && getHints()}

            <div className="secret-code-footer">
              <button className="hint-button" onClick={() => setShowHint(!showHint)}>
                {language === 'ru' ? 'Подсказка' : 'Hint'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecretCodeInput;