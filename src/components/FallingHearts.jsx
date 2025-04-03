import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';

/**
 * Компонент падающих сердечек для использования на разных страницах
 * @param {Object} props - Свойства компонента
 * @param {number} props.count - Количество сердечек (по умолчанию 15)
 * @param {string} props.containerClass - Класс для контейнера сердечек
 * @param {string} props.heartClass - Класс для сердечек
 * @param {string} props.color - Основной цвет сердечек (если не задан heartClass)
 */
const FallingHearts = ({ count = 15, containerClass, heartClass, color }) => {
  const [hearts, setHearts] = useState([]);

  // Создаем сердечки при монтировании компонента
  useEffect(() => {
    // Создаем массив сердечек с случайными параметрами
    const newHearts = Array.from({ length: count }, (_, i) => {
      const size = Math.random() * 20 + 10;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;
      const opacity = Math.random() * 0.5 + 0.3;

      return {
        id: i,
        style: {
          left: `${left}%`,
          fontSize: `${size}px`,
          color: color || `rgba(255, ${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${opacity})`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }
      };
    });

    setHearts(newHearts);
  }, [count, color]);

  return (
    <div className={containerClass || 'falling-hearts-container'}>
      {hearts.map(heart => (
        <FaHeart
          key={heart.id}
          className={heartClass || 'falling-heart'}
          style={heart.style}
        />
      ))}
    </div>
  );
};

export default FallingHearts;