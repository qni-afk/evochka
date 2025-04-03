/**
 * API сервис для взаимодействия с бэкендом
 */

// Базовый URL API - всегда используем локальный для разработки
const API_BASE_URL = 'http://localhost:5000/api';

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
export const getUserData = async (userId, signal) => {
  return apiRequest(`/user/${userId}`, 'GET', null, signal);
};

/**
 * Сохраняет все данные пользователя
 *
 * @param {string} userId - идентификатор пользователя
 * @param {Object} userData - данные пользователя
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<Object>} - результат операции
 */
export const saveUserData = async (userId, userData, signal) => {
  return apiRequest(`/user/${userId}`, 'POST', userData, signal);
};

/**
 * Обновляет отдельные данные пользователя
 *
 * @param {string} userId - идентификатор пользователя
 * @param {Object} updates - обновляемые данные
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<Object>} - результат операции
 */
export const updateUserData = async (userId, updates, signal) => {
  return apiRequest(`/user/${userId}`, 'PATCH', updates, signal);
};

/**
 * Проверяет статус API
 *
 * @param {AbortSignal} signal - сигнал для отмены запроса
 * @returns {Promise<Object>} - статус API
 */
export const checkApiHealth = async (signal) => {
  return apiRequest('/health', 'GET', null, signal);
};