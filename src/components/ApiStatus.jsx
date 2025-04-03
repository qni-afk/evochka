import React, { useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';
import '../styles/ApiStatus.css';

/**
 * Компонент для отображения статуса соединения с API
 * Отображает индикатор в правом нижнем углу экрана
 */
const ApiStatus = () => {
  const { apiStatus, checkApiStatus, offlineMode, toggleOfflineMode } = useApi();

  // Проверяем статус API при монтировании компонента
  useEffect(() => {
    // При первоначальной загрузке проверяем статус API
    if (!offlineMode) {
      // Добавляем небольшую задержку перед первой проверкой
      const initialCheckTimeout = setTimeout(() => {
        checkApiStatus();
      }, 1000);

      return () => clearTimeout(initialCheckTimeout);
    }
  }, [checkApiStatus, offlineMode]);

  // Периодически проверяем статус API каждые 3 минуты
  useEffect(() => {
    // Проверяем статус API только если не в офлайн режиме
    if (offlineMode) return;

    const intervalId = setInterval(() => {
      checkApiStatus();
    }, 180000); // Проверка каждые 3 минуты вместо 1 минуты

    return () => clearInterval(intervalId);
  }, [checkApiStatus, offlineMode]);

  // Если статус еще не определен, отображаем "Проверка соединения..."
  if (apiStatus === 'unknown' && !offlineMode) {
    return (
      <div className="api-status checking">
        <span className="api-status-indicator"></span>
        <span className="api-status-text">Проверка соединения...</span>
      </div>
    );
  }

  return (
    <div
      className={`api-status ${offlineMode ? 'offline' : apiStatus}`}
      title={offlineMode ? 'Нажмите для попытки подключения' : (apiStatus === 'up' ? 'API подключено' : 'API недоступно')}
      onClick={toggleOfflineMode}
    >
      <span className="api-status-indicator"></span>
      <span className="api-status-text">
        {offlineMode
          ? 'Автономный режим (нажмите для подключения)'
          : (apiStatus === 'up' ? 'Онлайн-синхронизация' : 'Подключение недоступно')}
      </span>
    </div>
  );
};

export default ApiStatus;