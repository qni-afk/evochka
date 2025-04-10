import React from 'react';
import { FaTrophy, FaHeart, FaStar, FaGift, FaCameraRetro } from 'react-icons/fa';

const AchievementsCard = ({ achievements }) => {
  // Если achievements не предоставлен, используем демонстрационные данные
  const achievementsToShow = achievements || [
    {
      id: 1,
      title: 'First Love',
      date: 'Dec 12, 2023',
      icon: 'heart'
    },
    {
      id: 2,
      title: 'Perfect Day',
      date: 'Jan 15, 2024',
      icon: 'star'
    },
    {
      id: 3,
      title: 'Gift Master',
      date: 'Feb 14, 2024',
      icon: 'gift'
    },
    {
      id: 4,
      title: 'Memory Maker',
      date: 'Mar 5, 2024',
      icon: 'camera'
    }
  ];

  // Функция для отображения иконки в зависимости от типа
  const renderIcon = (icon) => {
    switch (icon) {
      case 'heart':
        return <FaHeart />;
      case 'star':
        return <FaStar />;
      case 'gift':
        return <FaGift />;
      case 'camera':
        return <FaCameraRetro />;
      default:
        return <FaTrophy />;
    }
  };

  return (
    <div className="profile-card achievements-card">
      <div className="card-header">
        <h2 className="card-title">
          <FaTrophy className="card-icon" /> Achievements
        </h2>
      </div>
      <div className="card-content">
        <div className="achievements-grid">
          {achievementsToShow.map(achievement => (
            <div className="achievement-item" key={achievement.id}>
              <div className="achievement-icon">
                {renderIcon(achievement.icon)}
              </div>
              <div className="achievement-title">{achievement.title}</div>
              <div className="achievement-date">{achievement.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsCard;