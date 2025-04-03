import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Games.css';

function Games() {
  console.log('Games component rendering');
  const [gameState, setGameState] = useState('start');

  // Добавим эффект, который будет подтверждать, что компонент загрузился
  useEffect(() => {
    console.log('Games component mounted');

    // Добавим обработчик клика на весь документ
    const handleDocumentClick = (e) => {
      console.log('Document clicked', e.target);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // Обработчики кликов
  const handleStartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Start game button clicked');
    setGameState('playing');
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Back button clicked');
    setGameState('start');
  };

  console.log('Current game state:', gameState);

  // Упрощенная игровая логика
  const renderGameContent = () => {
    if (gameState === 'start') {
      return (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#4a305e', marginBottom: '20px' }}>
            Мини-игра "Садовник"
          </h1>
          <p style={{ color: '#4a6670', marginBottom: '30px' }}>
            Объединяйте одинаковые растения, чтобы создавать новые и зарабатывать очки!
          </p>

          <a
            href="#"
            onClick={handleStartClick}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(to right, #ff6b9c, #ff9cad)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontSize: '18px',
              textDecoration: 'none',
              display: 'inline-block',
              margin: '20px auto'
            }}
          >
            Начать игру 🎮
          </a>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#ff6b9c', marginBottom: '20px' }}>
            Игра загружена
          </h2>

          {/* Упрощенное игровое поле */}
          <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto 30px auto',
            background: 'rgba(255, 240, 245, 0.7)',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Игровое поле</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              marginBottom: '20px'
            }}>
              {[...Array(9)].map((_, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '24px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer'
                }}>
                  {['🌱', '🌿', '🪨'][Math.floor(Math.random() * 3)]}
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <button style={{
                padding: '10px 20px',
                background: 'linear-gradient(to right, #8e54e9, #4776e6)',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                cursor: 'pointer'
              }}>
                Добавить 🌱
              </button>
              <button style={{
                padding: '10px 20px',
                background: 'linear-gradient(to right, #8e54e9, #4776e6)',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                cursor: 'pointer'
              }}>
                Добавить 🌿
              </button>
              <button style={{
                padding: '10px 20px',
                background: 'linear-gradient(to right, #8e54e9, #4776e6)',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                cursor: 'pointer'
              }}>
                Добавить 🪨
              </button>
            </div>
          </div>

          <p style={{ color: '#555', marginBottom: '30px' }}>
            Нажимайте на элементы, чтобы создавать комбинации!
          </p>

          <a
            href="#"
            onClick={handleBackClick}
            style={{
              padding: '12px 25px',
              background: 'linear-gradient(to right, #ff9cad, #ff6b9c)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block',
              margin: '20px auto'
            }}
          >
            Вернуться
          </a>
        </div>
      );
    }
  };

  return (
    <div className="games-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f4a0a9 0%, #ffc3cd 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px'
    }}>
      {/* Упрощенная навигация */}
      <div style={{
        display: 'flex',
        gap: '20px',
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '10px 20px',
        borderRadius: '30px',
        margin: '20px 0'
      }}>
        <Link to="/eva" style={{ color: 'white', textDecoration: 'none' }}>Ева</Link>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Главная</Link>
        <Link to="/gallery" style={{ color: 'white', textDecoration: 'none' }}>Галерея</Link>
        <Link to="/games" style={{
          color: 'white',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>Игры</Link>
      </div>

      {/* Упрощенный контейнер игры */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        margin: '20px auto',
        maxWidth: '800px',
        width: '90%',
        textAlign: 'center'
      }}>
        {renderGameContent()}
      </div>
    </div>
  );
}

export default Games;