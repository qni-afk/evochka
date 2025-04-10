import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  checkApiHealth as apiCheckHealth,
  getUserData as apiGetUserData,
  saveUserData as apiSaveUserData,
  updateUserData as apiUpdateUserData,
  getAchievements as apiGetAchievements,
  getCircles as apiGetCircles,
  updateCircles as apiUpdateCircles,
  uploadCircleVideo as apiUploadCircleVideo
} from '../services/api';

// Создаем контекст API
const ApiContext = createContext();

/**
 * Хук для использования контекста API
 * @returns {Object} контекст API
 */
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi должен использоваться внутри ApiProvider');
  }
  return context;
};

/**
 * Провайдер контекста API
 * Обеспечивает управление состоянием API (статус, данные, ошибки)
 */
export const ApiProvider = ({ children }) => {
  const [apiStatus, setApiStatus] = useState('unknown'); // unknown, available, unavailable
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [achievements, setAchievements] = useState([]); // Состояние для достижений

  // Функция для проверки статуса API
  const checkApiStatus = useCallback(async () => {
    // Если уже в офлайн режиме, не проверяем API
    if (offlineMode) {
      console.log("ApiProvider: Проверка статуса API пропущена (офлайн режим)");
      setApiStatus('unavailable');
      return false;
    }

    console.log("ApiProvider: Начинаем проверку статуса API");
    console.log("ApiProvider: URL API =", import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
    setLoading(true);
    setError(null);

    try {
      console.log("ApiProvider: Отправка запроса на /health");
      const response = await apiCheckHealth();
      console.log("ApiProvider: Ответ API получен", response);
      console.log("ApiProvider: API доступен");
      setApiStatus('available');
      setOfflineMode(false);
      return true;
    } catch (err) {
      console.warn("ApiProvider: API недоступен", err);
      console.error("ApiProvider: Детали ошибки", {
        message: err.message,
        stack: err.stack,
        response: err.response,
        request: err.request
      });
      setApiStatus('unavailable');
      setOfflineMode(true); // Переключаемся в офлайн режим
      return false;
    } finally {
      setLoading(false);
    }
  }, [offlineMode]);

  // Проверка статуса API при монтировании
  useEffect(() => {
    console.log("ApiProvider: Первоначальная проверка статуса API");
    const timeoutId = setTimeout(() => {
      if (apiStatus === 'unknown') {
        console.log("ApiProvider: Таймаут проверки API, переключение в офлайн режим");
        setApiStatus('unavailable');
        setOfflineMode(true);
      }
    }, 5000); // Таймаут 5 секунд

    checkApiStatus();

    return () => clearTimeout(timeoutId);
  }, [checkApiStatus]); // Зависимость от checkApiStatus

  // Функция для загрузки данных пользователя
  const loadUserData = useCallback(async (userId) => {
    if (offlineMode) {
      console.warn("ApiProvider: Загрузка данных пользователя невозможна (офлайн режим)");
      return null; // Возвращаем null в офлайн режиме
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`ApiProvider: Загрузка данных для пользователя ${userId}`);
      console.log("ApiProvider: URL запроса =", `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/user/${userId}`);
      const data = await apiGetUserData(userId);
      console.log(`ApiProvider: Данные для ${userId} получены`, data);
      return data;
    } catch (err) {
      console.error('ApiProvider: Ошибка при загрузке данных пользователя', err);
      console.error("ApiProvider: Детали ошибки", {
        message: err.message,
        stack: err.stack,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        } : 'Нет ответа',
        request: err.request ? 'Запрос был отправлен' : 'Запрос не был отправлен'
      });
      setError(err.message || 'Ошибка загрузки данных');
      setApiStatus('unavailable');
      setOfflineMode(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, [offlineMode]);

  // Функция для сохранения данных пользователя
  const saveUserData = useCallback(async (userId, userData) => {
    if (offlineMode) {
      console.warn("ApiProvider: Сохранение данных пользователя невозможно (офлайн режим)");
      setError('Невозможно сохранить данные в офлайн режиме');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`ApiProvider: Сохранение данных для пользователя ${userId}`, userData);
      await apiSaveUserData(userId, userData);
      console.log(`ApiProvider: Данные для ${userId} успешно сохранены`);
      return true;
    } catch (err) {
      console.error('ApiProvider: Ошибка при сохранении данных пользователя', err);
      setError(err.message || 'Ошибка сохранения данных');
      setApiStatus('unavailable');
      setOfflineMode(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [offlineMode]);

  // Функция для обновления части данных пользователя
  const updateUserData = useCallback(async (userId, updates) => {
    if (offlineMode) {
      console.warn("ApiProvider: Обновление данных пользователя невозможно (офлайн режим)");
      setError('Невозможно обновить данные в офлайн режиме');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`ApiProvider: Обновление данных для пользователя ${userId}`, updates);
      await apiUpdateUserData(userId, updates);
      console.log(`ApiProvider: Данные для ${userId} успешно обновлены`);
      return true;
    } catch (err) {
      console.error('ApiProvider: Ошибка при обновлении данных пользователя', err);
      setError(err.message || 'Ошибка обновления данных');
      setApiStatus('unavailable');
      setOfflineMode(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [offlineMode]);

  // Функция для загрузки достижений
  const loadAchievements = useCallback(async (userId) => {
    if (offlineMode) {
      console.warn("ApiProvider: Загрузка достижений невозможна (офлайн режим)");
      setAchievements([]); // Возвращаем пустой массив в офлайн режиме
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`ApiProvider: Загрузка достижений для пользователя ${userId}`);
      const data = await apiGetAchievements(userId);
      console.log(`ApiProvider: Достижения для ${userId} получены`, data);
      setAchievements(data || []); // Устанавливаем пустой массив, если data null/undefined
    } catch (err) {
      console.error('ApiProvider: Ошибка при загрузке достижений', err);
      setError(err.message || 'Ошибка загрузки достижений');
      setApiStatus('unavailable');
      setOfflineMode(true);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }, [offlineMode]);

  // Функция для загрузки списка кружков
  const getCircles = useCallback(async () => {
    if (offlineMode) {
      console.warn("ApiProvider: Загрузка кружков невозможна (офлайн режим)");
      return [
        { id: 1, path: '/circle/circle1.mp4' },
        { id: 2, path: '/circle/circle2.mp4' },
        { id: 3, path: '/circle/circle3.mp4' }
      ]; // Возвращаем дефолтные данные в офлайн режиме
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`ApiProvider: Загрузка списка кружков`);
      const data = await apiGetCircles();
      console.log(`ApiProvider: Список кружков получен`, data);
      return data;
    } catch (err) {
      console.error('ApiProvider: Ошибка при загрузке списка кружков', err);
      setError(err.message || 'Ошибка загрузки кружков');
      setApiStatus('unavailable');
      setOfflineMode(true);
      return [
        { id: 1, path: '/circle/circle1.mp4' },
        { id: 2, path: '/circle/circle2.mp4' },
        { id: 3, path: '/circle/circle3.mp4' }
      ]; // Возвращаем дефолтные данные в случае ошибки
    } finally {
      setLoading(false);
    }
  }, [offlineMode]);

  // Функция для обновления списка кружков
  const updateCircles = useCallback(async (circles) => {
    if (offlineMode) {
      console.warn("ApiProvider: Обновление кружков невозможно (офлайн режим)");
      setError('Невозможно обновить кружки в офлайн режиме');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`ApiProvider: Обновление списка кружков`, circles);
      await apiUpdateCircles(circles);
      console.log(`ApiProvider: Список кружков успешно обновлен`);
      return true;
    } catch (err) {
      console.error('ApiProvider: Ошибка при обновлении списка кружков', err);
      setError(err.message || 'Ошибка обновления кружков');
      setApiStatus('unavailable');
      setOfflineMode(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [offlineMode]);

  // Функция для загрузки видео кружка
  const uploadCircleVideo = useCallback(async (file, circleId, onProgress) => {
    if (offlineMode) {
      console.warn("ApiProvider: Загрузка видео невозможна (офлайн режим)");
      setError('Невозможно загрузить видео в офлайн режиме');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`ApiProvider: Загрузка видео для кружка ${circleId}`);
      const result = await apiUploadCircleVideo(file, circleId, onProgress);
      console.log(`ApiProvider: Видео для кружка ${circleId} успешно загружено`, result);
      return result;
    } catch (err) {
      console.error('ApiProvider: Ошибка при загрузке видео', err);
      setError(err.message || 'Ошибка загрузки видео');
      return null;
    } finally {
      setLoading(false);
    }
  }, [offlineMode]);

  // Значения, предоставляемые контекстом
  const contextValue = {
    apiStatus,
    loading,
    error,
    offlineMode,
    setOfflineMode,
    checkApiStatus,
    loadUserData,
    saveUserData,
    updateUserData,
    achievements,
    loadAchievements,
    getCircles,
    updateCircles,
    uploadCircleVideo
  };

  console.log("ApiProvider: рендер с состоянием", { apiStatus, loading, error, offlineMode, achievements });

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;