import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState({});

  // При первом рендере проверяем, есть ли сохраненный токен аутентификации и список пользователей
  useEffect(() => {
    console.log("AuthProvider: проверка токена аутентификации");

    const checkAuth = async () => {
      try {
        // Загружаем сохраненный список пользователей или создаем дефолтный
        const savedUsers = localStorage.getItem('registered_users');
        if (savedUsers) {
          setRegisteredUsers(JSON.parse(savedUsers));
        } else {
          // Если списка нет, создаем его с двумя стандартными пользователями
          const defaultUsers = {
            'eva': { password: 'love', name: 'Eva' },
            'admin': { password: 'admin', name: 'Administrator' }
          };
          setRegisteredUsers(defaultUsers);
          localStorage.setItem('registered_users', JSON.stringify(defaultUsers));
        }

        // Проверяем, есть ли токен
        const token = localStorage.getItem('auth_token');
        console.log("AuthProvider: найден токен:", !!token);

        if (token) {
          // Получаем данные пользователя
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

          // Используем простую проверку - если есть токен и данные пользователя, считаем пользователя аутентифицированным
          if (userData && userData.username) {
            console.log("AuthProvider: проверка токена успешна для пользователя", userData.username);
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            console.log("AuthProvider: нет данных пользователя, сбрасываем аутентификацию");
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        // В случае ошибки сбрасываем состояние аутентификации
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Выполняем только при монтировании

  /**
   * Функция для регистрации нового пользователя
   * @param {string} username - имя пользователя
   * @param {string} password - пароль
   * @returns {boolean} - результат регистрации
   */
  const register = (username, password) => {
    console.log("AuthProvider: попытка регистрации для пользователя", username);
    setAuthError('');

    // Проверка, не существует ли уже пользователь с таким именем
    if (registeredUsers[username]) {
      setAuthError('Пользователь с таким именем уже существует');
      return false;
    }

    try {
      // Создаем нового пользователя
      const updatedUsers = {
        ...registeredUsers,
        [username]: { password, name: username }
      };

      // Сохраняем обновленный список пользователей
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

      console.log("AuthProvider: регистрация успешна");
      return true;
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      setAuthError('Произошла ошибка при регистрации');
      return false;
    }
  };

  /**
   * Функция для аутентификации пользователя
   * @param {string} username - имя пользователя
   * @param {string} password - пароль
   * @returns {boolean} - результат аутентификации
   */
  const login = async (username, password) => {
    console.log("AuthProvider: попытка входа для пользователя", username);
    setAuthError('');

    try {
      // Попытка использовать API для входа
      // try {
      //   const response = await axios.post('/api/auth/login', { username, password });
      //   const { token, user } = response.data;

      //   localStorage.setItem('auth_token', token);
      //   localStorage.setItem('user_data', JSON.stringify(user));
      //   setUser(user);
      //   setIsAuthenticated(true);
      //   console.log("AuthProvider: вход через API успешен");
      //   return true;
      // } catch (apiError) {
      //   console.error("API ошибка входа:", apiError);
      //   // Если API недоступен, используем локальную проверку
      // }

      // Временное решение, пока нет API
      // Проверка учетных данных по списку зарегистрированных пользователей
      const userInfo = registeredUsers[username];

      if (userInfo && userInfo.password === password) {
        // Создаем простой токен и сохраняем его в localStorage
        const token = `${username}_${Date.now()}`;
        const userData = { username, name: userInfo.name };

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        console.log("AuthProvider: вход успешен");
        return true;
      }

      console.log("AuthProvider: неверные учетные данные");
      setAuthError('Неверное имя пользователя или пароль');
      return false;
    } catch (error) {
      console.error("Общая ошибка входа:", error);
      setAuthError('Произошла ошибка при входе');
      return false;
    }
  };

  /**
   * Функция для выхода пользователя
   */
  const logout = () => {
    console.log("AuthProvider: выход пользователя");

    // Удаляем токен из localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Значения, предоставляемые контекстом
  const authValues = {
    isAuthenticated,
    login,
    logout,
    register,
    loading,
    authError,
    user
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