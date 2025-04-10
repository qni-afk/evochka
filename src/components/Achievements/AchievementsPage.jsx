import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../contexts/ApiContext';
import './Achievements.css';

// Резервные данные о достижениях (используются, если не удалось загрузить с сервера)
const achievementsData = [
  {
    id: 'start',
    title: "Начало пути",
    description: "Вы вместе уже 1 день!",
    icon: "✨",
    daysRequired: 1
  },
  {
    id: 'week',
    title: "Первая неделя",
    description: "Вместе уже 7 дней!",
    icon: "🗓️",
    daysRequired: 7
  },
  {
    id: 'month',
    title: "Первый месяц",
    description: "Целый месяц вместе!",
    icon: "💖",
    daysRequired: 30
  },
  {
    id: '100days',
    title: "100 дней вместе",
    description: "Отметили 100 дней отношений!",
    icon: "💯",
    daysRequired: 100
  },
  {
    id: 'halfyear',
    title: "Полгода любви",
    description: "Вместе уже 6 месяцев!",
    icon: "☀️",
    daysRequired: 183
  },
  {
    id: 'anniversary',
    title: "Годовщина",
    description: "Отпраздновали первый год вместе!",
    icon: "🎉",
    daysRequired: 365
  }
];

const AchievementsPage = () => {
  const { loading, error, achievements: apiAchievements, loadAchievements, offlineMode } = useApi();
  const [localAchievements, setLocalAchievements] = useState([]);
  const [daysTogether, setDaysTogether] = useState(0);
  const [notification, setNotification] = useState(null);
  const [relationshipStartDate, setRelationshipStartDate] = useState(null);

  // Загрузка даты начала отношений
  const loadRelationshipStartDate = useCallback(() => {
    // Сначала пытаемся загрузить из localStorage
    const savedDate = localStorage.getItem('eva_relationshipStartDate');
    if (savedDate) {
      console.log('Загружена дата начала отношений из localStorage:', savedDate);
      return new Date(savedDate);
    }
    
    // Если в localStorage нет, используем дефолтную дату из сервера
    console.log('Используется дефолтная дата начала отношений: 2023-12-09');
    return new Date("2023-12-09T00:00:00Z");
  }, []);

  // Расчет дней вместе
  const calculateDaysTogether = useCallback((startDate) => {
    if (!startDate) return 0;
    
    const today = new Date();
    const timeDiff = today - startDate;
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }, []);

  // Загрузка достижений из localStorage
  const loadLocalAchievements = useCallback(() => {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      try {
        return JSON.parse(savedAchievements);
      } catch (error) {
        console.error('Ошибка при парсинге достижений из localStorage:', error);
        return [];
      }
    }
    return achievementsData.map(achievement => ({
      ...achievement,
      dateUnlocked: null
    }));
  }, []);

  // Обновление достижений на основе дней вместе
  const updateAchievements = useCallback((days, currentAchievements) => {
    return currentAchievements.map(achievement => {
      if (!achievement.dateUnlocked && days >= achievement.daysRequired) {
        const newAchievement = {
          ...achievement,
          dateUnlocked: new Date().toISOString()
        };
        
        // Показать уведомление для новых достижений
        setNotification(newAchievement);
        
        return newAchievement;
      }
      return achievement;
    });
  }, []);

  // Инициализация при монтировании компонента
  useEffect(() => {
    console.log('AchievementsPage: Инициализация компонента');
    
    // Загружаем дату начала отношений
    const startDate = loadRelationshipStartDate();
    setRelationshipStartDate(startDate);
    
    // Рассчитываем количество дней вместе
    const days = calculateDaysTogether(startDate);
    setDaysTogether(days);
    
    // Загружаем достижения с сервера или из localStorage
    if (!offlineMode) {
      console.log('Пытаемся загрузить достижения с сервера');
      loadAchievements('eva');
    } else {
      console.log('Офлайн режим: загружаем достижения из localStorage');
      const localAchievs = loadLocalAchievements();
      const updatedAchievs = updateAchievements(days, localAchievs);
      setLocalAchievements(updatedAchievs);
      localStorage.setItem('achievements', JSON.stringify(updatedAchievs));
    }
  }, [loadRelationshipStartDate, calculateDaysTogether, loadLocalAchievements, updateAchievements, loadAchievements, offlineMode]);
  
  // Обработка изменений в apiAchievements
  useEffect(() => {
    if (apiAchievements && apiAchievements.length > 0) {
      console.log('Получены достижения с сервера:', apiAchievements);
      setLocalAchievements(apiAchievements);
      localStorage.setItem('achievements', JSON.stringify(apiAchievements));
      
      // Проверяем, есть ли новые достижения
      const localAchievs = loadLocalAchievements();
      const newAchievements = apiAchievements.filter(ach => 
        !localAchievs.some(localAch => localAch.id === ach.id && localAch.dateUnlocked)
      );
      
      if (newAchievements.length > 0) {
        setNotification(newAchievements[0]);
      }
    }
  }, [apiAchievements, loadLocalAchievements]);
  
  // Эффект для скрытия уведомления через 5 секунд
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Расчет прогресса для незаработанных достижений
  const calculateProgress = (requiredDays) => {
    const progress = Math.min(Math.floor((daysTogether / requiredDays) * 100), 99);
    return progress;
  };

  // Определяем, какие достижения показывать
  const displayAchievements = offlineMode ? localAchievements : (apiAchievements.length > 0 ? apiAchievements : localAchievements);

  return (
    <div className="achievements-page">
      <h1 className="section-title">Наши Достижения</h1>
      <p className="section-description">Отмечаем важные моменты нашей истории любви</p>
      
      {loading && !displayAchievements.length ? (
        <div className="loading-message">Загрузка достижений...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="achievements-container">
          {displayAchievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement ${achievement.dateUnlocked || achievement.unlockedDate ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              <div className="achievement-info">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                {(achievement.dateUnlocked || achievement.unlockedDate) ? (
                  <p className="unlock-date">
                    Получено: {new Date(achievement.dateUnlocked || achievement.unlockedDate).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="progress">
                    Прогресс: {calculateProgress(achievement.daysRequired)}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="relationship-stats">
        <div className="stat-card">
          <h3>Дней вместе</h3>
          <p>{daysTogether}</p>
        </div>
        <div className="stat-card">
          <h3>Достижений открыто</h3>
          <p>{displayAchievements.filter(a => a.dateUnlocked || a.unlockedDate).length}/{displayAchievements.length}</p>
        </div>
      </div>
      
      {notification && (
        <div className="achievement-notification show">
          <h3>Новое достижение!</h3>
          <p>{notification.title}</p>
          <p>{notification.description}</p>
          <button 
            className="close-notification" 
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;