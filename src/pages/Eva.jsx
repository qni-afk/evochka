import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import ThemeLanguageSwitcher from '../components/ThemeLanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Eva.css';
import { FaHeart, FaStar, FaCamera, FaGift, FaMagic, FaRegSmile, FaList, FaCrown, FaCheck, FaPalette } from 'react-icons/fa';
import { GiDiamondRing, GiButterflyFlower, GiPartyPopper, GiPalmTree, GiCupcake, GiShoppingBag } from 'react-icons/gi';
import { BsEmojiHeartEyes, BsStars } from 'react-icons/bs';

const Eva = () => {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('features');
  const [animation, setAnimation] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [moodRating, setMoodRating] = useState(0);
  const [wishes, setWishes] = useState([
    { id: 1, text: 'Провести день на природе', completed: false },
    { id: 2, text: 'Посетить новый ресторан', completed: false },
    { id: 3, text: 'Сходить в кино на премьеру', completed: true },
  ]);
  const [newWish, setNewWish] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [features, setFeatures] = useState([
    { id: 1, text: 'Поездка в парк аттракционов', emoji: '🎡', liked: false, priority: 'high' },
    { id: 2, text: 'Совместная готовка', emoji: '👩‍🍳', liked: true, priority: 'medium' },
    { id: 3, text: 'Прогулка по набережной', emoji: '🌅', liked: false, priority: 'low' },
    { id: 4, text: 'Посмотреть новый фильм', emoji: '🎬', liked: true, priority: 'medium' },
  ]);
  const [newFeature, setNewFeature] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [filterPriority, setFilterPriority] = useState('all');
  const [colorTheme, setColorTheme] = useState('pink');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const evaRef = useRef(null);
  const containerRef = useRef(null);
  const emojiOptions = ['❤️', '🎮', '🎬', '🎭', '🎨', '🎸', '🏄‍♀️', '🚴‍♀️', '🧗‍♀️', '🏂', '🏕️', '🌅', '🍿', '🍕', '🍦', '🍹', '👗', '💃', '🎡', '🎯'];

  const memories = [
    { id: 1, title: 'First meeting', date: '09.12.2023', image: '/images/photo_2025-02-28_01-09-21.jpg' },
    { id: 2, title: "New Year's Eve", date: '31.12.2023', image: '/images/eva white.jpg' },
    { id: 3, title: "Eva's birthday", date: '05.03.2023', image: '/images/eva blue.jpg' },
    { id: 4, title: 'My birthday', date: '08.08.2024', image: '/images/eva sex.jpg' },
    { id: 5, title: 'One year together', date: '09.12.2024', image: '/images/image_2025-02-28_01-11-28.png' },
    { id: 6, title: 'Two years together', date: '09.12.2025', image: '/images/photo_2024-06-17_22-32-56.jpg' },
  ];

  const compliments = [
    'You are the most beautiful!',
    'Your smile brightens my day',
    'You are my favorite girl',
    'I am the happiest with you',
    'You are infinitely gorgeous',
    'You make me better',
    'Your eyes are like two stars',
    'I love your laughter',
    'You are my inspiration',
    'You are perfect in every way'
  ];

  const colorThemes = {
    pink: {
      primary: '#ff6b9c',
      secondary: '#ff9cad',
      light: '#fff0f6',
      accent: '#ffcd3c'
    },
    purple: {
      primary: '#9c55ff',
      secondary: '#c28aff',
      light: '#f5f0ff',
      accent: '#ffcd3c'
    },
    teal: {
      primary: '#00c9a7',
      secondary: '#4adec9',
      light: '#e6fff8',
      accent: '#ffa64d'
    },
    blue: {
      primary: '#5271ff',
      secondary: '#7892ff',
      light: '#f0f4ff',
      accent: '#ffcd3c'
    }
  };

  const themes = [
    { name: 'pink', class: 'theme-pink' },
    { name: 'purple', class: 'theme-purple' },
    { name: 'teal', class: 'theme-teal' },
    { name: 'blue', class: 'theme-blue' },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('eva_activeTab', tab);
  };

  const sendCompliment = () => {
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
    }, 2000);
  };

  const addHearts = (e) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const newHearts = Array(5).fill().map((_, i) => ({
      id: Date.now() + i,
      x: mouseX,
      y: mouseY,
      size: Math.random() * 20 + 10,
      color: `hsl(${Math.random() * 60 + 330}, 100%, 70%)`,
      duration: Math.random() * 2 + 1,
      direction: Math.random() * 360
    }));

    setHearts([...hearts, ...newHearts]);

    setTimeout(() => {
      setHearts(hearts => hearts.filter(heart => !newHearts.includes(heart)));
    }, 3000);
  };

  const toggleWish = (id) => {
    const updatedWishes = wishes.map(wish =>
      wish.id === id ? { ...wish, completed: !wish.completed } : wish
    );

    setWishes(updatedWishes);

    // Явно сохраняем в localStorage после изменения
    setTimeout(() => saveToLocalStorage(), 100);

    if (!wishes.find(wish => wish.id === id).completed) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  };

  const addWish = () => {
    if (newWish.trim() !== '') {
      const newWishes = [
        ...wishes,
        { id: Date.now(), text: newWish, completed: false }
      ];
      setWishes(newWishes);
      setNewWish('');

      // Явно сохраняем в localStorage после изменения
      setTimeout(() => saveToLocalStorage(), 100);
    }
  };

  const toggleFeatureLike = (id) => {
    const updatedFeatures = features.map(feature =>
      feature.id === id ? { ...feature, liked: !feature.liked } : feature
    );

    setFeatures(updatedFeatures);

    // Явно сохраняем в localStorage после изменения
    setTimeout(() => saveToLocalStorage(), 100);
  };

  const changePriority = (id) => {
    const priorities = ['low', 'medium', 'high'];
    const updatedFeatures = features.map(feature => {
      if (feature.id === id) {
        const currentIndex = priorities.indexOf(feature.priority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        return { ...feature, priority: priorities[nextIndex] };
      }
      return feature;
    });

    setFeatures(updatedFeatures);

    // Явно сохраняем в localStorage после изменения
    setTimeout(() => saveToLocalStorage(), 100);
  };

  const addFeature = () => {
    if (newFeature.trim() !== '') {
      const newFeatures = [
        ...features,
        {
          id: Date.now(),
          text: newFeature,
          emoji: selectedEmoji,
          liked: false,
          priority: 'medium'
        }
      ];
      setFeatures(newFeatures);
      setNewFeature('');

      // Явно сохраняем в localStorage после изменения
      setTimeout(() => saveToLocalStorage(), 100);
    }
  };

  const getFilteredFeatures = () => {
    if (filterPriority === 'all') return features;
    return features.filter(feature => feature.priority === filterPriority);
  };

  const changeColorTheme = (theme) => {
    setColorTheme(theme);
    setShowColorPicker(false);

    // Dynamically update CSS variables
    document.documentElement.style.setProperty('--primary-color', colorThemes[theme].primary);
    document.documentElement.style.setProperty('--secondary-color', colorThemes[theme].secondary);
    document.documentElement.style.setProperty('--light-color', colorThemes[theme].light);
    document.documentElement.style.setProperty('--accent-color', colorThemes[theme].accent);
  };

  const randomCompliment = () => {
    return compliments[Math.floor(Math.random() * compliments.length)];
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'ru' ? 'en' : 'ru');
  };

  useEffect(() => {
    // Effect for animation on page load
    const timer = setTimeout(() => {
      if (evaRef.current) {
        evaRef.current.classList.add('loaded');
      }
    }, 300);

    // Initialize default theme
    changeColorTheme(colorTheme);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Применяем тему при загрузке
    document.body.className = `theme-${colorTheme}`;

    return () => {
      document.body.className = '';
    };
  }, [colorTheme]);

  useEffect(() => {
    setTimeout(() => {
      setAnimation(true);
    }, 500);
  }, []);

  const handleHeartClick = (e) => {
    const heartId = Date.now();
    const x = e.clientX;
    const y = e.clientY;
    setHearts((prevHearts) => [...prevHearts, { id: heartId, x, y }]);

    setTimeout(() => {
      setHearts((prevHearts) => prevHearts.filter((heart) => heart.id !== heartId));
    }, 1000);
  };

  const generateConfetti = () => {
    setConfetti(true);
    setTimeout(() => {
      setConfetti(false);
    }, 5000);
  };

  const handleWishToggle = (id) => {
    const updatedWishes = wishes.map((wish) =>
      wish.id === id ? { ...wish, completed: !wish.completed } : wish
    );

    setWishes(updatedWishes);

    // Явно сохраняем в localStorage после изменения
    setTimeout(() => saveToLocalStorage(), 100);

    if (!wishes.find((wish) => wish.id === id).completed) {
      generateConfetti();
    }
  };

  const handleWishSubmit = (e) => {
    e.preventDefault();
    if (newWish.trim() === '') return;

    const id = wishes.length ? Math.max(...wishes.map((wish) => wish.id)) + 1 : 1;
    const newWishes = [...wishes, { id, text: newWish, completed: false }];
    setWishes(newWishes);
    setNewWish('');
  };

  const renderConfetti = () => {
    if (!confetti) return null;

    const confettiElements = [];
    const colors = ['#ff6b9c', '#ffcd3c', '#ff9cad', '#ffd1dc', '#fff0f6'];

    for (let i = 0; i < 100; i++) {
      const left = Math.random() * 100;
      const width = Math.random() * 10 + 5;
      const height = Math.random() * 10 + 5;
      const backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 5;

      confettiElements.push(
        <div
          key={i}
          className="confetti"
          style={{
            left: `${left}%`,
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor,
            animationDelay: `${delay}s`,
          }}
        />
      );
    }

    return confettiElements;
  };

  // Функция для сохранения данных в localStorage
  const saveToLocalStorage = () => {
    try {
      console.log("Сохраняю данные:", { wishes, features, moodRating, colorTheme });
      localStorage.setItem('eva_wishes', JSON.stringify(wishes));
      localStorage.setItem('eva_features', JSON.stringify(features));
      localStorage.setItem('eva_mood', JSON.stringify(moodRating));
      localStorage.setItem('eva_colorTheme', colorTheme);
      console.log("Данные сохранены успешно");
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
    }
  };

  // Загрузка данных из localStorage
  useEffect(() => {
    try {
      console.log("Загружаю данные из localStorage");
      const savedWishes = localStorage.getItem('eva_wishes');
      const savedFeatures = localStorage.getItem('eva_features');
      const savedMood = localStorage.getItem('eva_mood');
      const savedTheme = localStorage.getItem('eva_colorTheme');
      const savedTab = localStorage.getItem('eva_activeTab');

      console.log("Загруженные данные:", {
        savedWishes,
        savedFeatures,
        savedMood,
        savedTheme,
        savedTab
      });

      if (savedWishes) {
        setWishes(JSON.parse(savedWishes));
      }

      if (savedFeatures) {
        setFeatures(JSON.parse(savedFeatures));
      }

      if (savedMood) {
        setMoodRating(JSON.parse(savedMood));
      }

      if (savedTheme) {
        setColorTheme(savedTheme);
      }

      if (savedTab) {
        setActiveTab(savedTab);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  }, []);

  // Сохранение данных при изменении
  useEffect(() => {
    // Предотвращаем сохранение при первой загрузке
    if (wishes.length || features.length) {
      saveToLocalStorage();
    }
  }, [wishes, features, moodRating, colorTheme]);

  return (
    <div className={`eva-page ${colorTheme}`} ref={containerRef} onClick={handleHeartClick}>
      <Navbar />

      <ThemeLanguageSwitcher />

      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="floating-heart"
          initial={{
            x: heart.x,
            y: heart.y,
            opacity: 1,
            scale: 0
          }}
          animate={{
            x: heart.x + Math.cos(heart.direction) * 100,
            y: heart.y - 100 - Math.random() * 50,
            opacity: 0,
            scale: heart.size / 10
          }}
          transition={{
            duration: heart.duration,
            ease: "easeOut"
          }}
          style={{ color: heart.color }}
        >
          <FaHeart />
        </motion.div>
      ))}

      <div className="confetti-container">{renderConfetti()}</div>

      <header className="eva-header">
        <div className={`profile-container ${animation ? 'loaded' : ''}`} ref={evaRef}>
          <div className="eva-profile">
            <img src="/images/eva white.jpg" alt="Eva" className="profile-pic" />
            <div className="profile-info">
              <h1>Eva <GiButterflyFlower className="name-icon" /></h1>
              <p className="profile-subtitle">{t('eva', 'mySweetGirl')}</p>
              <div className="mood-meter">
                <p>{t('eva', 'moodToday')}</p>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= moodRating ? 'star active' : 'star'}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMoodRating(star);
                        // Явно сохраняем после изменения настроения
                        setTimeout(() => saveToLocalStorage(), 100);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="tabs">
        <button
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => handleTabChange('gallery')}
        >
          <FaCamera /> {t('eva', 'gallery')}
        </button>
        <button
          className={activeTab === 'wishes' ? 'active' : ''}
          onClick={() => handleTabChange('wishes')}
        >
          <FaGift /> {t('eva', 'wishes')}
        </button>
        <button
          className={activeTab === 'features' ? 'active' : ''}
          onClick={() => handleTabChange('features')}
        >
          <FaList /> {t('eva', 'features')}
        </button>
        <button
          className={activeTab === 'compliments' ? 'active' : ''}
          onClick={() => handleTabChange('compliments')}
        >
          <FaRegSmile /> {t('eva', 'compliments')}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'gallery' && (
          <div className="memories-section">
            <h2>{t('eva', 'ourMemories')} <FaCamera /></h2>
            <div className="memories-grid">
              {memories.map((memory) => (
                <motion.div
                  key={memory.id}
                  className="memory-card"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(255, 156, 173, 0.4)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="memory-image">
                    <img src={memory.image} alt={memory.title} />
                  </div>
                  <div className="memory-info">
                    <h3>{memory.title}</h3>
                    <p>{memory.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wishes' && (
          <div className="wishes-section">
            <h2>{t('eva', 'wishList')} <FaGift /></h2>
            <form className="wish-input" onSubmit={handleWishSubmit}>
              <input
                type="text"
                placeholder={t('eva', 'addNewWish')}
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
              />
              <button type="submit">{t('common', 'add')}</button>
            </form>
            <ul className="wishes-list">
              {wishes.map((wish) => (
                <motion.li
                  key={wish.id}
                  className={wish.completed ? 'completed' : ''}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleWishToggle(wish.id)}
                >
                  <span className="wish-text">{wish.text}</span>
                  <span className="wish-check">{wish.completed ? '✓' : '○'}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="features-section">
            <h2>{t('eva', 'featureList')} <GiPalmTree /></h2>

            <div className="feature-filters">
              <p>{t('eva', 'filterByPriority')}</p>
              <div className="priority-buttons">
                <button
                  className={filterPriority === 'all' ? 'active' : ''}
                  onClick={() => setFilterPriority('all')}
                >
                  {t('eva', 'all')}
                </button>
                <button
                  className={`${filterPriority === 'high' ? 'active high' : ''}`}
                  onClick={() => setFilterPriority('high')}
                >
                  {t('eva', 'high')} <FaCrown />
                </button>
                <button
                  className={`${filterPriority === 'medium' ? 'active medium' : ''}`}
                  onClick={() => setFilterPriority('medium')}
                >
                  {t('eva', 'medium')} <BsStars />
                </button>
                <button
                  className={`${filterPriority === 'low' ? 'active low' : ''}`}
                  onClick={() => setFilterPriority('low')}
                >
                  {t('eva', 'low')} <GiCupcake />
                </button>
              </div>
            </div>

            <div className="feature-input">
              <div className="input-group">
                <input
                  type="text"
                  placeholder={t('eva', 'addNewActivity')}
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <div className="emoji-selector">
                  <span className="selected-emoji">{selectedEmoji}</span>
                  <div className="emoji-dropdown">
                    {emojiOptions.map(emoji => (
                      <span
                        key={emoji}
                        className="emoji-option"
                        onClick={() => setSelectedEmoji(emoji)}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={addFeature}>{t('common', 'add')}</button>
            </div>

            <motion.ul
              className="features-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {getFilteredFeatures().map((feature) => (
                <motion.li
                  key={feature.id}
                  className={`feature-item priority-${feature.priority}`}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: feature.liked ? 'rgba(255, 182, 193, 0.3)' : 'rgba(255, 245, 247, 0.5)'
                  }}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="feature-content">
                    <span className="feature-emoji">{feature.emoji}</span>
                    <span className="feature-text">{feature.text}</span>
                  </div>
                  <div className="feature-actions">
                    <button
                      className={`priority-indicator ${feature.priority}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        changePriority(feature.id);
                      }}
                      title={`${t('eva', 'filterByPriority')} ${t('eva', feature.priority)} (${t('common', 'changeTheme')})`}
                    >
                      {feature.priority === 'high' && <FaCrown />}
                      {feature.priority === 'medium' && <BsStars />}
                      {feature.priority === 'low' && <GiCupcake />}
                    </button>
                    <button
                      className={`like-button ${feature.liked ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFeatureLike(feature.id);
                      }}
                    >
                      {feature.liked ? <BsEmojiHeartEyes /> : <FaHeart />}
                    </button>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <div className="feature-info">
              <div className="info-card">
                <GiShoppingBag className="info-icon" />
                <div className="info-text">
                  <h3>{t('eva', 'funActivitiesTogether')}</h3>
                  <p>{t('eva', 'funActivitiesDescription')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliments' && (
          <div className="compliments-section">
            <h2>{t('eva', 'compliments')} <FaRegSmile /></h2>
            <div className="compliment-card">
              <motion.div
                className={`compliment-text ${animation ? 'animate' : ''}`}
                animate={animation ? {
                  scale: [1, 1.2, 1],
                  color: [
                    'hsl(340, 100%, 76%)',
                    'hsl(360, 100%, 70%)',
                    'hsl(340, 100%, 76%)'
                  ]
                } : {}}
                transition={{ duration: 2 }}
              >
                {randomCompliment()}
              </motion.div>
              <button className="compliment-button" onClick={sendCompliment}>
                <FaMagic /> {t('eva', 'newCompliment')}
              </button>
            </div>
            <div className="love-note">
              <GiDiamondRing className="love-icon" />
              <p>{t('eva', 'loveNote')}</p>
            </div>
          </div>
        )}
      </div>

      <div className="eva-footer">
        <p>{t('common', 'withLove')} ❤️</p>
        <GiPartyPopper className="footer-icon" />
      </div>
    </div>
  );
};

export default Eva;