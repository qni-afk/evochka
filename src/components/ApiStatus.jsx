import React, { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import '../styles/ApiStatus.css';

/**
 * Компонент для отображения статуса соединения с API
 * Отображает индикатор в правом нижнем углу экрана
 */
const ApiStatus = () => {
  const { apiStatus, checkApiStatus, offlineMode, setOfflineMode } = useApi();
  const [lastChecked, setLastChecked] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // Проверяем статус API при монтировании компонента
  useEffect(() => {
    // При первоначальной загрузке проверяем статус API
    if (!offlineMode) {
      // Добавляем небольшую задержку перед первой проверкой
      const initialCheckTimeout = setTimeout(async () => {
        await checkApiStatus();
        setLastChecked(new Date());
      }, 1000);

      return () => clearTimeout(initialCheckTimeout);
    }
  }, [checkApiStatus, offlineMode]);

  // Периодически проверяем статус API каждые 30 секунд
  useEffect(() => {
    // Проверяем статус API только если не в офлайн режиме
    if (offlineMode) return;

    const intervalId = setInterval(async () => {
      await checkApiStatus();
      setLastChecked(new Date());
    }, 30000); // Проверка каждые 30 секунд

    return () => clearInterval(intervalId);
  }, [checkApiStatus, offlineMode]);

  const handleStatusClick = async () => {
    if (offlineMode) {
      setOfflineMode(false);
      await checkApiStatus();
      setLastChecked(new Date());
    } else {
      setExpanded(!expanded);
    }
  };

  const handleForceCheck = async (e) => {
    e.stopPropagation();
    await checkApiStatus();
    setLastChecked(new Date());
  };

  const formatTime = (date) => {
    if (!date) return 'Не проверялось';
    return date.toLocaleTimeString();
  };

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
      className={`api-status ${offlineMode ? 'offline' : apiStatus === 'available' ? 'available' : 'unavailable'} ${expanded ? 'expanded' : ''}`}
      title={offlineMode ? 'Нажмите для попытки подключения' : 'Нажмите для дополнительной информации'}
      onClick={handleStatusClick}
    >
      <span className="api-status-indicator"></span>
      <span className="api-status-text">
        {offlineMode
          ? 'Автономный режим (нажмите для подключения)'
          : (apiStatus === 'available' ? 'API доступно' : 'API недоступно')}
      </span>

      {expanded && (
        <div className="api-status-details">
          <p>URL API: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</p>
          <p>Статус: {apiStatus}</p>
          <p>Последняя проверка: {formatTime(lastChecked)}</p>
          <button onClick={handleForceCheck} className="force-check-btn">
            Проверить сейчас
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiStatus;