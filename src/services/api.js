/**
 * API сервис для взаимодействия с бэкендом
 */

import axios from 'axios';

// Базовый URL API - используем переменную окружения или дефолтное значение
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Service initialized with URL:', API_BASE_URL);

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // таймаут 10 секунд
  withCredentials: false // меняем на false для упрощения CORS
});

// Перехватчик запросов для отладки
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Перехватчик ответов для отладки
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error('API Response Error:', error.message);
    if (error.response) {
      console.error('Response details:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('Request was made but no response received');
    }
    return Promise.reject(error);
  }
);

/**
 * Выполняет запрос к API
 *
 * @param {string} url - путь к API endpoint
 * @param {string} method - HTTP метод (GET, POST, PATCH, и т.д.)
 * @param {Object} data - данные для отправки (для POST/PATCH запросов)
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<any>} - ответ API
 */
const apiRequest = async (url, method = 'GET', data = null, signal = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Добавляем сигнал для возможности отмены запроса
    if (signal) {
      options.signal = signal;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, options);

    // Если ответ успешный, парсим JSON
    if (response.ok) {
      return await response.json();
    }

    // Если ответ не успешный, пробуем получить JSON с ошибкой
    const errorData = await response.json().catch(() => ({
      error: `HTTP error: ${response.status} ${response.statusText}`
    }));

    throw new Error(errorData.error || 'Ошибка при взаимодействии с API');
  } catch (error) {
    // Если это ошибка AbortError (прерывание запроса), мы её перебрасываем без логирования
    if (error.name === 'AbortError') {
      throw error;
    }

    // Другие ошибки логируем
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Получает данные пользователя
 *
 * @param {string} userId - идентификатор пользователя
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<Object>} - данные пользователя
 */
export const getUserData = async (userId) => {
  try {
    console.log(`API Service: Запрос данных пользователя ${userId}`);
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    // Возвращаем null или обрабатываем ошибку по-другому
    if (error.response && error.response.status === 404) {
      return null; // Пользователь не найден
    } else {
      throw error;
    }
  }
};

/**
 * Сохраняет все данные пользователя
 *
 * @param {string} userId - идентификатор пользователя
 * @param {Object} userData - данные пользователя
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<Object>} - результат операции
 */
export const saveUserData = async (userId, data) => {
  try {
    await api.post(`/user/${userId}`, data);
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении данных пользователя:', error);
    throw new Error('Не удалось сохранить данные пользователя');
  }
};

/**
 * Обновляет отдельные данные пользователя
 *
 * @param {string} userId - идентификатор пользователя
 * @param {Object} updates - обновляемые данные
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<Object>} - результат операции
 */
export const updateUserData = async (userId, updates) => {
  try {
    await api.patch(`/user/${userId}`, updates);
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении данных пользователя:', error);
    throw new Error('Не удалось обновить данные пользователя');
  }
};

/**
 * Проверяет статус API
 *
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<Object>} - статус API
 */
export const checkApiHealth = async () => {
  try {
    console.log('API Service: Проверка доступности API');
    const response = await api.get(`/health`);
    return response.data;
  } catch (error) {
    console.error('API Service: Ошибка проверки доступности API', error);
    throw error;
  }
};

/**
 * Отправляет запрос на получение достижений пользователя
 * @param {string} userId - ID пользователя
 * @returns {Promise<Array|null>} Массив достижений или null в случае ошибки
 */
export const getAchievements = async (userId) => {
  try {
    const response = await api.get(`/achievements/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении достижений:', error);
    throw new Error('Не удалось получить достижения');
  }
};

/**
 * Получает список кружков
 * @returns {Promise<Array>} Массив кружков
 */
export const getCircles = async () => {
  try {
    console.log('API Service: Запрос списка кружков');
    const response = await api.get('/circles');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении списка кружков:', error);
    throw new Error('Не удалось получить список кружков');
  }
};

/**
 * Обновляет список кружков
 * @param {Array} circles - обновленный список кружков
 * @returns {Promise<Object>} - результат операции
 */
export const updateCircles = async (circles) => {
  try {
    console.log('API Service: Обновление списка кружков', circles);
    const response = await api.post('/circles', circles);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении списка кружков:', error);
    throw new Error('Не удалось обновить список кружков');
  }
};

/**
 * Загружает видео кружка на сервер
 * @param {File} file - файл видео
 * @param {number} circleId - ID кружка
 * @param {Function} onProgress - функция для отслеживания прогресса загрузки
 * @returns {Promise<Object>} - результат операции
 */
export const uploadCircleVideo = async (file, circleId, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('video', file);

    const response = await api.post(`/upload-circle/${circleId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке видео кружка:', error);
    throw new Error('Не удалось загрузить видео кружка');
  }
};