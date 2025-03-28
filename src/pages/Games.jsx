import React, { useState, useEffect } from 'react';
import '../styles/Games.css';
import MusicPlayer from '../components/MusicPlayer';

function Games() {
  const [gameStarted, setGameStarted] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [score, setScore] = useState(0);
  const [achievement, setAchievement] = useState(false);
  const [currentNotification, setCurrentNotification] = useState('');
  const [draggedFlower, setDraggedFlower] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [level, setLevel] = useState(1);
  const [combinations, setCombinations] = useState([]);
  const [maxFlowers, setMaxFlowers] = useState(36); // Увеличено до 6x6
  const [achievements, setAchievements] = useState([]);
  const [coins, setCoins] = useState(0);
  const [grid, setGrid] = useState(Array(36).fill(null)); // 6x6 сетка
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]); // Для отслеживания выбранных элементов
  const [combo, setCombo] = useState(0); // Для отслеживания комбо
  const [energy, setEnergy] = useState(500); // Увеличено максимальное количество энергии
  const [maxEnergy, setMaxEnergy] = useState(500); // Новая переменная для максимальной энергии
  const [showShop, setShowShop] = useState(false);
  const [dailyEnergyCollected, setDailyEnergyCollected] = useState(false);
  const [lastAdWatchTime, setLastAdWatchTime] = useState(0);
  const [shopItems] = useState([
    { id: 1, name: 'Ножки', energy: 500, cost: 'Фото', icon: '👣', type: 'bot_content', photoType: 'legs' },
    { id: 2, name: 'Улыбка', energy: 400, cost: 'Фото', icon: '😊', type: 'bot_content', photoType: 'smile' },
    { id: 3, name: 'Фотография в платье', energy: 300, cost: 'Фото', icon: '👗', type: 'bot_content', photoType: 'dress' },
    { id: 4, name: 'Кружочек с поцелуйчиком', energy: 250, cost: 'Фото', icon: '💋', type: 'bot_content', photoType: 'kiss' },
    { id: 5, name: 'Секси гифка', energy: 200, cost: 'Фото', icon: '🎀', type: 'bot_content', photoType: 'sexy' },
    { id: 6, name: 'Малое зелье энергии', energy: 25, cost: 50, icon: '🧪', type: 'potion' },
    { id: 7, name: 'Большое зелье энергии', energy: 50, cost: 90, icon: '⚗️', type: 'potion' },
    { id: 8, name: 'Кристалл энергии', energy: 100, cost: 150, icon: '💎', type: 'potion' },
    { id: 9, name: 'Автоматический сборщик', duration: 300, cost: 200, icon: '🤖', type: 'buff' },
    { id: 10, name: 'Ускоритель роста', duration: 180, cost: 100, icon: '⚡', type: 'buff' }
  ]);
  const [activeBuffs, setActiveBuffs] = useState([]);
  const [autoCollector, setAutoCollector] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [processingPurchase, setProcessingPurchase] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Обновленные массивы эмодзи и их уровни
  const itemTiers = {
    // Цветочная линия
    '🌱': { tier: 1, next: '🌸', points: 10, requires: 3 },
    '🌸': { tier: 2, next: '🌹', points: 20, requires: 3 },
    '🌹': { tier: 3, next: '🌺', points: 40, requires: 3 },
    '🌺': { tier: 4, next: '💐', points: 80, requires: 3 },
    '💐': { tier: 5, next: '🌈', points: 160, requires: 3 },
    '🌈': { tier: 6, next: null, points: 320 },

    // Дерево линия
    '🌿': { tier: 1, next: '🪴', points: 15, requires: 3 },
    '🪴': { tier: 2, next: '🌳', points: 30, requires: 3 },
    '🌳': { tier: 3, next: '🌲', points: 60, requires: 3 },
    '🌲': { tier: 4, next: '🎋', points: 120, requires: 3 },
    '🎋': { tier: 5, next: null, points: 240 },

    // Декоративная линия
    '🪨': { tier: 1, next: '⛲', points: 20, requires: 3 },
    '⛲': { tier: 2, next: '🏮', points: 40, requires: 3 },
    '🏮': { tier: 3, next: '🎪', points: 80, requires: 3 },
    '🎪': { tier: 4, next: null, points: 160 },
  };

  // Начальные элементы
  const baseItems = ['🌱', '🌿', '🪨'];

  // Функция для получения случайного базового элемента
  const getRandomBaseItem = () => {
    return baseItems[Math.floor(Math.random() * baseItems.length)];
  };

  // Функция для проверки возможности объединения
  const canMerge = (items) => {
    if (items.length !== 3) return false;
    return items.every(item => item === items[0]) && itemTiers[items[0]]?.next !== null;
  };

  // Функция для добавления нового элемента
  const addNewItem = () => {
    if (energy < 10) {
      setCurrentNotification('Недостаточно энергии! Подождите восстановления.');
      setAchievement(true);
      return;
    }

    const emptySpots = grid.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
    if (emptySpots.length === 0) {
      setCurrentNotification('Нет свободного места! Объедините элементы.');
      setAchievement(true);
      return;
    }

    const randomSpot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
    const newItem = getRandomBaseItem();

    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[randomSpot] = newItem;
      return newGrid;
    });

    setEnergy(prev => Math.max(0, prev - 10)); // Уменьшаем энергию
  };

  // Обработчик клика по ячейке
  const handleCellClick = (index) => {
    if (!grid[index]) return;

    setSelectedElements(prev => {
      const newSelected = [...prev];
      const itemIndex = newSelected.indexOf(index);

      if (itemIndex === -1) {
        if (newSelected.length < 3) {
          newSelected.push(index);
        }
      } else {
        newSelected.splice(itemIndex, 1);
      }

      // Проверяем, можно ли объединить выбранные элементы
      if (newSelected.length === 3) {
        const items = newSelected.map(idx => grid[idx]);
        if (canMerge(items)) {
          const nextTier = itemTiers[items[0]].next;
          const points = itemTiers[items[0]].points;

          setGrid(prev => {
            const newGrid = [...prev];
            newSelected.forEach(idx => newGrid[idx] = null);
            newGrid[newSelected[0]] = nextTier;
            return newGrid;
          });

          setScore(prev => prev + points);
          setCombo(prev => prev + 1);
          setCoins(prev => prev + Math.floor(points * (1 + combo * 0.1)));

          setCombinations(prev => [{
            id: Date.now(),
            text: `${items[0]} + ${items[0]} + ${items[0]} = ${nextTier} (+${points} очков)`
          }, ...prev.slice(0, 9)]);

          setCurrentNotification(`Создан ${nextTier}! +${points} очков! Комбо x${combo + 1}`);
          setAchievement(true);
          return [];
        }
      }

      return newSelected;
    });
  };

  // Восстановление энергии
  useEffect(() => {
    const energyTimer = setInterval(() => {
      setEnergy(prev => Math.min(maxEnergy, prev + 5));
    }, 10000);

    return () => clearInterval(energyTimer);
  }, [maxEnergy]);

  // Сброс комбо через некоторое время
  useEffect(() => {
    if (combo > 0) {
      const comboTimer = setTimeout(() => {
        setCombo(0);
      }, 5000);

      return () => clearTimeout(comboTimer);
    }
  }, [combo]);

  // Эффект для автоматического скрытия уведомлений
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        setAchievement(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  // Функция для получения ежедневной энергии
  const collectDailyEnergy = () => {
    if (!dailyEnergyCollected) {
      setEnergy(prev => Math.min(maxEnergy, prev + 50));
      setDailyEnergyCollected(true);
      setCurrentNotification('Получено 50 энергии! Приходите завтра за новой порцией!');
      setAchievement(true);

      // Сброс флага в полночь
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeUntilMidnight = tomorrow - now;

      setTimeout(() => {
        setDailyEnergyCollected(false);
      }, timeUntilMidnight);
    }
  };

  // Функция для просмотра рекламы
  const watchAdForEnergy = () => {
    const now = Date.now();
    if (now - lastAdWatchTime >= 300000) { // 5 минут кулдаун
      setEnergy(prev => Math.min(maxEnergy, prev + 30));
      setLastAdWatchTime(now);
      setCurrentNotification('Получено 30 энергии за просмотр рекламы!');
      setAchievement(true);
    } else {
      const remainingTime = Math.ceil((300000 - (now - lastAdWatchTime)) / 1000);
      setCurrentNotification(`Подождите ${remainingTime} секунд перед следующим просмотром`);
      setAchievement(true);
    }
  };

  // Функция для обработки выбора фотографии
  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedPhoto(file);
    }
  };

  // Обновленная функция покупки предмета
  const buyItem = (item) => {
    if (item.type === 'bot_content') {
      // Открываем диалог выбора фотографии
      document.getElementById('photo-input').click();
      setProcessingPurchase(true);
      // Сохраняем текущий выбранный предмет для последующей обработки
      setCurrentItem(item);
    } else if (coins >= item.cost) {
      setCoins(prev => prev - item.cost);

      if (item.type === 'potion') {
        setEnergy(prev => Math.min(maxEnergy, prev + item.energy));
        setCurrentNotification(`Использовано ${item.name}! +${item.energy} энергии`);
      } else if (item.type === 'buff') {
        const buff = {
          ...item,
          endTime: Date.now() + item.duration * 1000
        };

        setActiveBuffs(prev => [...prev, buff]);

        if (item.name === 'Автоматический сборщик') {
          setAutoCollector(buff);
        }

        setCurrentNotification(`Активирован ${item.name}! Длительность: ${item.duration} сек.`);
      }

      setAchievement(true);
    }
  };

  // Функция для завершения покупки после выбора фотографии
  const completePurchase = async (item) => {
    if (selectedPhoto) {
      try {
        // Здесь будет логика отправки фото в бота
        setCurrentNotification(`Отправка фотографии для получения: ${item.name}`);

        // После успешной отправки
        setEnergy(prev => Math.min(maxEnergy, prev + item.energy));
        setCurrentNotification(`Получено: ${item.name}! +${item.energy} энергии`);
        setSelectedPhoto(null);
        setProcessingPurchase(false);
        setAchievement(true);
      } catch (error) {
        setCurrentNotification('Ошибка при отправке фотографии');
        setSelectedPhoto(null);
        setProcessingPurchase(false);
        setAchievement(true);
      }
    }
  };

  // Эффект для автоматического сборщика
  useEffect(() => {
    if (autoCollector) {
      const interval = setInterval(() => {
        if (Date.now() >= autoCollector.endTime) {
          setAutoCollector(null);
          setCurrentNotification('Автоматический сборщик завершил работу');
          setAchievement(true);
          clearInterval(interval);
        } else {
          addNewItem();
        }
      }, 10000); // Каждые 10 секунд

      return () => clearInterval(interval);
    }
  }, [autoCollector]);

  // Эффект для проверки баффов
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBuffs(prev => {
        const now = Date.now();
        const active = prev.filter(buff => buff.endTime > now);
        if (active.length !== prev.length) {
          setCurrentNotification('Действие некоторых бонусов закончилось');
          setAchievement(true);
        }
        return active;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Функция для начала перетаскивания
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    setDraggedIndex(index);
    e.target.style.opacity = '0.5';
  };

  // Функция для окончания перетаскивания
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
  };

  // Функция для перетаскивания над ячейкой
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const draggedItem = grid[draggedIndex];
    const targetItem = grid[index];

    // Подсветка возможности объединения
    if (targetItem && draggedItem === targetItem && itemTiers[draggedItem]?.next) {
      e.currentTarget.classList.add('can-merge');
    }
  };

  // Функция для выхода из зоны ячейки
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('can-merge');
  };

  // Функция для отпускания элемента
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove('can-merge');

    if (draggedIndex === null) return;

    const draggedItem = grid[draggedIndex];
    const targetItem = grid[targetIndex];

    // Если целевая ячейка пуста
    if (!targetItem) {
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[targetIndex] = draggedItem;
        newGrid[draggedIndex] = null;
        return newGrid;
      });
    }
    // Если элементы одинаковые и можно объединить
    else if (draggedItem === targetItem && itemTiers[draggedItem]?.next) {
      // Находим третий такой же элемент
      const thirdIndex = grid.findIndex((item, idx) =>
        item === draggedItem && idx !== draggedIndex && idx !== targetIndex
      );

      if (thirdIndex !== -1) {
        const nextTier = itemTiers[draggedItem].next;
        const points = itemTiers[draggedItem].points;

        setGrid(prev => {
          const newGrid = [...prev];
          newGrid[draggedIndex] = null;
          newGrid[targetIndex] = null;
          newGrid[thirdIndex] = nextTier;
          return newGrid;
        });

        setScore(prev => prev + points);
        setCombo(prev => prev + 1);
        setCoins(prev => prev + Math.floor(points * (1 + combo * 0.1)));

        setCombinations(prev => [{
          id: Date.now(),
          text: `${draggedItem} + ${draggedItem} + ${draggedItem} = ${nextTier} (+${points} очков)`
        }, ...prev.slice(0, 9)]);

        setCurrentNotification(`Создан ${nextTier}! +${points} очков! Комбо x${combo + 1}`);
        setAchievement(true);
      }
    }

    setDraggedIndex(null);
  };

  // Эффект для обработки выбранной фотографии
  useEffect(() => {
    if (selectedPhoto && currentItem && processingPurchase) {
      completePurchase(currentItem);
    }
  }, [selectedPhoto]);

  return (
    <div className="page-container">
      <div className="dream-garden-container">
        {!gameStarted ? (
          <div className="start-game-panel">
            <h2>Волшебный сад</h2>
            <p>Объединяйте три одинаковых элемента для создания более редких!</p>
            <div className="combination-hint">
              <h3>Как играть:</h3>
              <ul>
                <li>Выбирайте три одинаковых элемента для объединения</li>
                <li>Создавайте более редкие элементы для получения больше очков</li>
                <li>Собирайте комбо для увеличения награды</li>
                <li>Следите за энергией - она нужна для создания новых элементов</li>
              </ul>
            </div>
            <button className="start-button" onClick={() => setGameStarted(true)}>
              <span className="button-icon">🌱</span>
              Начать игру
            </button>
          </div>
        ) : (
          <>
            <div className="game-header">
              <div className="stats-container">
                <div className="stat-item">Уровень: {level}</div>
                <div className="stat-item">Очки: {score}</div>
                <div className="stat-item">Монеты: {coins}</div>
                <div className="stat-item">Комбо: x{combo}</div>
              </div>
              <div className="energy-container">
                <div className="energy-bar">
                  <div className="energy-fill" style={{ width: `${energy}%` }}></div>
                  <span className="energy-text">Энергия: {energy}%</span>
                </div>
                <div className="energy-actions">
                  <button
                    className="energy-button"
                    onClick={collectDailyEnergy}
                    disabled={dailyEnergyCollected}
                  >
                    {dailyEnergyCollected ? '✅' : '🎁'} Ежедневная энергия
                  </button>
                  <button
                    className="energy-button"
                    onClick={watchAdForEnergy}
                    disabled={Date.now() - lastAdWatchTime < 300000}
                  >
                    ▶ Смотреть рекламу (+30 энергии)
                  </button>
                  <button
                    className="shop-button"
                    onClick={() => setShowShop(!showShop)}
                  >
                    🛒 Магазин
                  </button>
                </div>
              </div>
              {activeBuffs.length > 0 && (
                <div className="active-buffs">
                  {activeBuffs.map(buff => (
                    <div key={buff.id} className="buff-item">
                      {buff.icon} {buff.name} ({Math.ceil((buff.endTime - Date.now()) / 1000)}с)
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showShop && (
              <div className="shop-container">
                <div className="shop-content">
                  <h3>🛒 Магазин</h3>

                  <div className="shop-section">
                    <h4 className="shop-section-title">🏆 Специальные предложения</h4>
                    <p className="shop-section-description">
                      Отправьте фотографию через бота, чтобы получить особые награды
                    </p>
                    <div className="shop-items">
                      {shopItems
                        .filter(item => item.type === 'bot_content')
                        .map(item => (
                          <div key={item.id} className={`shop-item bot-content`}>
                            <span className="shop-item-icon">{item.icon}</span>
                            <div className="shop-item-info">
                              <div className="shop-item-name">{item.name}</div>
                              <div className="shop-item-description">
                                {processingPurchase && currentItem?.id === item.id
                                  ? 'Обработка фотографии...'
                                  : `Получите ${item.energy} энергии за фото`}
                              </div>
                              <div className="shop-item-cost">
                                {processingPurchase && currentItem?.id === item.id
                                  ? '🖼 Загрузка...'
                                  : '📸 Отправить фото'}
                              </div>
                            </div>
                            <button
                              className={`buy-button photo-upload ${
                                processingPurchase && currentItem?.id === item.id ? 'processing' : ''
                              }`}
                              onClick={() => buyItem(item)}
                              disabled={processingPurchase}
                            >
                              {processingPurchase && currentItem?.id === item.id
                                ? 'Обработка...'
                                : 'Выбрать фото'}
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <input
                    type="file"
                    id="photo-input"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoSelect}
                  />

                  <div className="shop-section">
                    <h4 className="shop-section-title">🧪 Зелья энергии</h4>
                    <div className="shop-items">
                      {shopItems
                        .filter(item => item.type === 'potion')
                        .map(item => (
                          <div key={item.id} className={`shop-item potion`}>
                            <span className="shop-item-icon">{item.icon}</span>
                            <div className="shop-item-info">
                              <div className="shop-item-name">{item.name}</div>
                              <div className="shop-item-description">
                                +{item.energy} энергии
                              </div>
                              <div className="shop-item-cost">💰 {item.cost}</div>
                            </div>
                            <button
                              className="buy-button"
                              onClick={() => buyItem(item)}
                              disabled={coins < item.cost}
                            >
                              Купить
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="shop-section">
                    <h4 className="shop-section-title">⚡ Бонусы</h4>
                    <div className="shop-items">
                      {shopItems
                        .filter(item => item.type === 'buff')
                        .map(item => (
                          <div key={item.id} className={`shop-item buff`}>
                            <span className="shop-item-icon">{item.icon}</span>
                            <div className="shop-item-info">
                              <div className="shop-item-name">{item.name}</div>
                              <div className="shop-item-description">
                                Длительность: {item.duration} сек.
                              </div>
                              <div className="shop-item-cost">💰 {item.cost}</div>
                            </div>
                            <button
                              className="buy-button"
                              onClick={() => buyItem(item)}
                              disabled={coins < item.cost}
                            >
                              Купить
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <button className="close-shop" onClick={() => setShowShop(false)}>
                    ❌ Закрыть
                  </button>
                </div>
              </div>
            )}

            <div className="game-controls">
              <button
                onClick={addNewItem}
                className="add-item-button"
                disabled={energy < 10}
              >
                Добавить элемент (10 энергии)
              </button>
            </div>

            <div className="grid-container">
              {grid.map((item, index) => (
                <div
                  key={index}
                  className={`grid-cell ${selectedElements.includes(index) ? 'selected' : ''} ${item ? 'filled' : ''}`}
                  onClick={() => handleCellClick(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {item && (
                    <div
                      className={`grid-item ${draggedIndex === index ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      {item}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {combinations.length > 0 && (
              <div className="combinations-list">
                <h3>История комбинаций:</h3>
                {combinations.map(combo => (
                  <div key={combo.id} className="combination-item">
                    {combo.text}
                  </div>
                ))}
              </div>
            )}

            {achievement && (
              <div className="achievement">
                {currentNotification}
              </div>
            )}
          </>
        )}
      </div>
      <MusicPlayer />
    </div>
  );
}

export default Games;