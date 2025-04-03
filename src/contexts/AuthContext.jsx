import React, { createContext, useState, useContext, useEffect } from 'react';

// Создаем контекст для аутентификации
const AuthContext = createContext();

/**
 * Провайдер контекста аутентификации
 * Предоставляет функции для входа, выхода и проверки статуса аутентификации
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // При первом рендере проверяем, есть ли сохраненный токен аутентификации
  useEffect(() => {
    console.log("AuthProvider: проверка токена аутентификации");

    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        console.log("AuthProvider: найден токен:", !!token);

        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Выполняем только при монтировании

  /**
   * Функция для аутентификации пользователя
   * @param {string} username - имя пользователя
   * @param {string} password - пароль
   * @returns {boolean} - результат аутентификации
   */
  const login = (username, password) => {
    console.log("AuthProvider: попытка входа для пользователя", username);

    setAuthError('');

    // Проверка учетных данных (только для eva/love)
    if (username === 'eva' && password === 'love') {
      // Создаем простой токен и сохраняем его в localStorage
      const token = `${username}_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
      console.log("AuthProvider: вход успешен");
      return true;
    }

    console.log("AuthProvider: неверные учетные данные");
    setAuthError('Неверное имя пользователя или пароль');
    return false;
  };

  /**
   * Функция для выхода пользователя
   */
  const logout = () => {
    console.log("AuthProvider: выход пользователя");

    // Удаляем токен из localStorage
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  // Значения, предоставляемые контекстом
  const authValues = {
    isAuthenticated,
    login,
    logout,
    loading,
    authError
  };

  console.log("AuthProvider: текущее состояние - isAuthenticated:", isAuthenticated, "loading:", loading);

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Хук для использования контекста аутентификации
 * @returns {Object} - контекст аутентификации
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;