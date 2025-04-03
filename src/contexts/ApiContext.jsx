import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';

// Создаем контекст API
const ApiContext = createContext();

/**
 * Провайдер контекста API
 * Управляет состоянием загрузки и ошибками при работе с API
 */
export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'up', 'down', 'unknown'
  const [offlineMode, setOfflineMode] = useState(false); // Флаг для офлайн режима

  // Проверяем статус API при запуске компонента
  useEffect(() => {
    console.log("ApiContext: первоначальная проверка API");

    // Установим таймаут в 5 секунд для первоначальной проверки
    const initTimeout = setTimeout(() => {
      if (apiStatus === 'unknown') {
        console.log('API health check timed out, switching to offline mode');
        setApiStatus('down');
        setOfflineMode(true);
      }
    }, 5000);

    // Выполняем первоначальную проверку
    checkApiStatus();

    return () => clearTimeout(initTimeout);
  }, []);

  /**
   * Проверяет доступность API
   */
  const checkApiStatus = async () => {
    // Если офлайн режим включен, не делаем проверку
    if (offlineMode) {
      console.log("ApiContext: офлайн режим, пропускаем проверку API");
      return;
    }

    console.log("ApiContext: проверка доступности API");
    setLoading(true);
    setError(null);

    try {
      // Добавим таймаут для запроса
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await api.checkApiHealth(controller.signal);
      clearTimeout(timeoutId);

      console.log("ApiContext: API доступен");
      setApiStatus('up');
      setOfflineMode(false);
    } catch (error) {
      // Не логируем ошибки отмены запроса
      if (error.name !== 'AbortError') {
        console.error('API status check failed:', error);
      } else {
        console.log("ApiContext: проверка API прервана по таймауту");
      }
      setApiStatus('down');
      setError('Не удалось подключиться к API');

      // Автоматически включаем офлайн режим
      console.log("ApiContext: переключение в офлайн режим");
      setOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Загружает данные пользователя
   * @param {string} userId - идентификатор пользователя
   * @returns {Promise<Object>} - данные пользователя или null в случае ошибки
   */
  const loadUserData = async (userId) => {
    // Если офлайн режим, сразу возвращаем null, чтобы использовать localStorage
    if (offlineMode) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Добавим таймаут для запроса
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const data = await api.getUserData(userId, controller.signal);
      clearTimeout(timeoutId);

      return data;
    } catch (error) {
      // Не логируем ошибки отмены запроса
      if (error.name !== 'AbortError') {
        console.error('Error loading user data:', error);
      }
      setError('Не удалось загрузить данные пользователя');

      // Включаем офлайн режим при ошибке
      setOfflineMode(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Сохраняет данные пользователя
   * @param {string} userId - идентификатор пользователя
   * @param {Object} userData - данные для сохранения
   * @returns {Promise<boolean>} - успешно ли сохранены данные
   */
  const saveUserData = async (userId, userData) => {
    // Если офлайн режим, не отправляем запрос
    if (offlineMode) {
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Добавим таймаут для запроса
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await api.saveUserData(userId, userData, controller.signal);
      clearTimeout(timeoutId);

      return true;
    } catch (error) {
      // Не логируем ошибки отмены запроса
      if (error.name !== 'AbortError') {
        console.error('Error saving user data:', error);
      }
      setError('Не удалось сохранить данные пользователя');

      // Включаем офлайн режим при ошибке
      setOfflineMode(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обновляет частичные данные пользователя
   * @param {string} userId - идентификатор пользователя
   * @param {Object} updates - обновляемые данные
   * @returns {Promise<boolean>} - успешно ли обновлены данные
   */
  const updateUserData = async (userId, updates) => {
    // Если офлайн режим, не отправляем запрос
    if (offlineMode) {
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Добавим таймаут для запроса
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await api.updateUserData(userId, updates, controller.signal);
      clearTimeout(timeoutId);

      return true;
    } catch (error) {
      // Не логируем ошибки отмены запроса
      if (error.name !== 'AbortError') {
        console.error('Error updating user data:', error);
      }
      setError('Не удалось обновить данные пользователя');

      // Включаем офлайн режим при ошибке
      setOfflineMode(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Переключение между офлайн и онлайн режимами
   */
  const toggleOfflineMode = () => {
    const newMode = !offlineMode;
    setOfflineMode(newMode);

    // Если включаем онлайн режим, проверяем статус API
    if (!newMode) {
      checkApiStatus();
    } else {
      setApiStatus('down');
    }
  };

  // Значения, предоставляемые контекстом
  const contextValue = {
    loading,
    error,
    apiStatus,
    offlineMode,
    checkApiStatus,
    loadUserData,
    saveUserData,
    updateUserData,
    toggleOfflineMode
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

/**
 * Хук для использования контекста API
 * @returns {Object} API context value
 */
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default ApiContext;