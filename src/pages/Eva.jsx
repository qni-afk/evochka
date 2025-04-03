import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import ThemeLanguageSwitcher from '../components/ThemeLanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Eva.css';
import { FaHeart, FaStar, FaCamera, FaGift, FaMagic, FaRegSmile, FaList, FaCrown, FaCheck, FaPalette, FaSignOutAlt } from 'react-icons/fa';
import { GiDiamondRing, GiButterflyFlower, GiPartyPopper, GiPalmTree, GiCupcake, GiShoppingBag } from 'react-icons/gi';
import { BsEmojiHeartEyes, BsStars } from 'react-icons/bs';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';

const Eva = () => {
  const { t, language, setLanguage } = useLanguage();
  const { logout, isAuthenticated, loading: authLoading } = useAuth();
  const { loading, error, saveUserData, loadUserData, offlineMode } = useApi();
  const [activeTab, setActiveTab] = useState('features');
  const [animation, setAnimation] = useState(false);
  const [moodRating, setMoodRating] = useState(0);
  const [wishes, setWishes] = useState([
    { id: 1, text: 'Провести день на природе', completed: false },
    { id: 2, text: 'Посетить новый ресторан', completed: false },
    { id: 3, text: 'Сходить в кино на премьеру', completed: true },
  ]);
  const [newWish, setNewWish] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [features, setFeatures] = useState([
    { id: 1, text: 'Красивая', stars: 5 },
    { id: 2, text: 'Умная', stars: 5 },
    { id: 3, text: 'Заботливая', stars: 5 },
  ]);
  const [newFeature, setNewFeature] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [filterPriority, setFilterPriority] = useState('all');
  const [colorTheme, setColorTheme] = useState('purple');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const evaRef = useRef(null);
  const containerRef = useRef(null);
  const emojiOptions = ['❤️', '🎮', '🎬', '🎭', '🎨', '🎸', '🏄‍♀️', '🚴‍♀️', '🧗‍♀️', '🏂', '🏕️', '🌅', '🍿', '🍕', '🍦', '🍹', '👗', '💃', '🎡', '🎯'];

  // Добавляю состояние для API
  const [apiMessage, setApiMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const addFeature = (text) => {
    if (!text || !text.trim()) return;

    const newFeatureItem = {
          id: Date.now(),
      text: text.trim(),
      stars: 5
    };

    const updatedFeatures = [...features, newFeatureItem];
    setFeatures(updatedFeatures);

    // Очищаем поле ввода
      setNewFeature('');

    // Сохраняем данные локально и, при необходимости, на сервере
    saveToLocalStorage(updatedFeatures, wishes, moodRating, colorTheme, activeTab);
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

  const generateConfetti = () => {
    const confettiCount = 100;
    const confettiElements = [];

    for (let i = 0; i < confettiCount; i++) {
      const left = Math.random() * 100;
      const width = Math.random() * 8 + 2;
      const height = Math.random() * 3 + 2;
      const bg = `hsl(${Math.random() * 360}, 100%, 50%)`;

      confettiElements.push(
        <div
          key={`confetti-${i}-${Math.random()}`}
          className="confetti"
          style={{
            left: `${left}%`,
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: bg,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      );
    }

    return confettiElements;
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
          key={`confetti-${i}-${Math.random()}`}
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

  // Функция выхода из аккаунта
  const handleLogout = () => {
    // Сохраняем данные перед выходом
    saveToLocalStorage();
    // Затем выполняем выход
    logout();
  };

  // Загрузка данных пользователя из API
  useEffect(() => {
    console.log("Eva: начало загрузки данных пользователя");

    // Флаг для предотвращения загрузки данных при размонтировании
    let isActive = true;

    const fetchUserData = async () => {
      try {
        // Если в офлайн режиме, сразу загружаем данные из localStorage
        if (offlineMode) {
          console.log("Eva: офлайн режим, загрузка из localStorage");
          loadFromLocalStorage();
          return;
        }

        console.log("Eva: попытка загрузки данных с сервера");
        const userData = await loadUserData('eva');

        // Проверяем, что компонент все еще смонтирован
        if (!isActive) {
          console.log("Eva: компонент размонтирован, прерываем обработку");
          return;
        }

        if (userData) {
          console.log("Eva: данные с сервера получены", userData);
          // Если данные получены успешно, обновляем состояния компонента
          if (userData.wishes) setWishes(userData.wishes);
          if (userData.features) setFeatures(userData.features);
          if (userData.moodRating) setMoodRating(userData.moodRating);
          if (userData.colorTheme) setColorTheme(userData.colorTheme);
          if (userData.activeTab) setActiveTab(userData.activeTab);

          setApiMessage('Данные успешно загружены с сервера');
          setTimeout(() => {
            if (isActive) setApiMessage('');
          }, 3000);
        } else {
          // Если с сервера не пришли данные, загружаем из localStorage
          console.log("Eva: данные с сервера не получены, загрузка из localStorage");
          loadFromLocalStorage();
        }
      } catch (err) {
        console.error('Error loading data from API:', err);
        // Если не удалось загрузить данные с сервера, загружаем из localStorage
        if (isActive) {
          console.log("Eva: ошибка загрузки с сервера, загрузка из localStorage");
          loadFromLocalStorage();
        }
      }
    };

    fetchUserData();

    // Очистка при размонтировании
    return () => {
      console.log("Eva: размонтирование компонента");
      isActive = false;
    };
  }, [loadUserData, offlineMode]); // Зависимости только loadUserData и offlineMode

  // Изменяем функцию saveToLocalStorage для сохранения как в localStorage, так и на сервере
  const saveToLocalStorage = (
    featuresData = features,
    wishesData = wishes,
    moodRatingData = moodRating,
    colorThemeData = colorTheme,
    activeTabData = activeTab
  ) => {
    // Сохраняем данные в localStorage
    const data = {
      wishes: wishesData,
      features: featuresData,
      moodRating: moodRatingData,
      colorTheme: colorThemeData,
      activeTab: activeTabData
    };

    localStorage.setItem('eva_data', JSON.stringify(data));

    // Сохраняем данные на сервере через API только если не в офлайн режиме
    if (!offlineMode) {
      saveToServer(data);
    }
  };

  // Функция для сохранения данных на сервере
  const saveToServer = async (data) => {
    if (isSaving) return; // Предотвращаем множественные запросы сохранения

    setIsSaving(true);

    try {
      const success = await saveUserData('eva', data);

      if (success) {
        setApiMessage('Данные успешно сохранены на сервере');
        setTimeout(() => setApiMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error saving data to API:', err);
      setApiMessage('Ошибка при сохранении данных на сервере');
      setTimeout(() => setApiMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Функция для загрузки данных из localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('eva_data');

      if (savedData) {
        const data = JSON.parse(savedData);

        if (data.wishes) setWishes(data.wishes);
        if (data.features) setFeatures(data.features);
        if (data.moodRating) setMoodRating(data.moodRating);
        if (data.colorTheme) setColorTheme(data.colorTheme);
        if (data.activeTab) setActiveTab(data.activeTab);

        setApiMessage('Данные загружены из локального хранилища');
        setTimeout(() => setApiMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
    }
  };

  // Компонент для одного желания
  const WishItem = ({ wish }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(wish.text);

    const toggleWish = (e) => {
      e.stopPropagation(); // Предотвращаем срабатывание родительских обработчиков
      const updatedWishes = wishes.map(w =>
        w.id === wish.id ? { ...w, completed: !w.completed } : w
      );
      setWishes(updatedWishes);
      saveToLocalStorage();
    };

    const handleEdit = (e) => {
      e.stopPropagation(); // Предотвращаем срабатывание родительских обработчиков
      setIsEditing(true);
      setEditText(wish.text);
    };

    const handleSave = (e) => {
      e.stopPropagation(); // Предотвращаем срабатывание родительских обработчиков
      if (editText.trim()) {
        const updatedWishes = wishes.map(w =>
          w.id === wish.id ? { ...w, text: editText.trim() } : w
        );
        setWishes(updatedWishes);
        saveToLocalStorage();
      }
      setIsEditing(false);
    };

    const handleCancel = (e) => {
      e.stopPropagation(); // Предотвращаем срабатывание родительских обработчиков
      setIsEditing(false);
      setEditText(wish.text);
    };

    const handleDelete = (e) => {
      e.stopPropagation(); // Предотвращаем срабатывание родительских обработчиков
      if (confirm(language === 'ru' ? 'Вы уверены, что хотите удалить это желание?' : 'Are you sure you want to delete this wish?')) {
        const updatedWishes = wishes.filter(w => w.id !== wish.id);
        setWishes(updatedWishes);
        saveToLocalStorage();
      }
    };

    return (
      <div className={`wish-item ${wish.completed ? 'completed' : ''}`} onClick={toggleWish}>
        {isEditing ? (
          <div className="wish-edit-form" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="wish-edit-input"
              autoFocus
            />
            <div className="wish-edit-buttons">
              <button onClick={handleSave} className="wish-save-btn">
                {language === 'ru' ? 'Сохранить' : 'Save'}
              </button>
              <button onClick={handleCancel} className="wish-cancel-btn">
                {language === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="checkbox" onClick={toggleWish}>
              {wish.completed && <span className="checkmark">✓</span>}
            </span>
            <span className="wish-text">{wish.text}</span>
            <div className="wish-actions">
              <button onClick={handleEdit} className="wish-edit-btn">
                ✏️
              </button>
              <button onClick={handleDelete} className="wish-delete-btn">
                🗑️
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // Компонент для одной характеристики
  const FeatureItem = ({ feature }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(feature.text);

    const renderStars = () => {
      return Array(5).fill().map((_, index) => (
        <span
          key={index}
          className={`star ${index < feature.stars ? 'filled' : ''}`}
          onClick={() => updateStars(feature.id, index + 1)}
        >
          ★
        </span>
      ));
    };

    const updateStars = (id, stars) => {
      const updatedFeatures = features.map(f =>
        f.id === id ? { ...f, stars } : f
      );
      setFeatures(updatedFeatures);
      saveToLocalStorage();
    };

    const handleEdit = () => {
      setIsEditing(true);
      setEditText(feature.text);
    };

    const handleSave = () => {
      if (editText.trim()) {
        const updatedFeatures = features.map(f =>
          f.id === feature.id ? { ...f, text: editText.trim() } : f
        );
        setFeatures(updatedFeatures);
        saveToLocalStorage();
      }
      setIsEditing(false);
    };

    const handleCancel = () => {
      setIsEditing(false);
      setEditText(feature.text);
    };

    const handleDelete = () => {
      if (confirm(language === 'ru' ? 'Вы уверены, что хотите удалить это качество?' : 'Are you sure you want to delete this feature?')) {
        const updatedFeatures = features.filter(f => f.id !== feature.id);
        setFeatures(updatedFeatures);
        saveToLocalStorage();
      }
    };

    return (
      <div className="feature-item">
        {isEditing ? (
          <div className="feature-edit-form">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="feature-edit-input"
              autoFocus
            />
            <div className="feature-edit-buttons">
              <button onClick={handleSave} className="feature-save-btn">
                {language === 'ru' ? 'Сохранить' : 'Save'}
              </button>
              <button onClick={handleCancel} className="feature-cancel-btn">
                {language === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="feature-text">{feature.text}</span>
            <div className="feature-actions">
              <div className="star-rating">
                {renderStars()}
              </div>
              <div className="feature-buttons">
                <button onClick={handleEdit} className="feature-edit-btn">
                  ✏️
                </button>
                <button onClick={handleDelete} className="feature-delete-btn">
                  🗑️
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Компонент для выбора цветовой схемы
  const ColorThemeSelector = () => {
    const themes = ['purple', 'pink', 'blue', 'green', 'orange'];

    const handleThemeChange = (theme) => {
      setColorTheme(theme);
      document.documentElement.setAttribute('data-theme', theme);
      saveToLocalStorage();
    };

    return (
      <div className="color-theme-selector">
        <h3>{language === 'ru' ? 'Цветовая схема' : 'Color Theme'}</h3>
        <div className="color-options">
          {themes.map(theme => (
            <div
              key={theme}
              className={`color-option ${theme} ${colorTheme === theme ? 'selected' : ''}`}
              onClick={() => handleThemeChange(theme)}
            />
          ))}
        </div>
      </div>
    );
  };

  // Компонент для отображения оценки настроения
  const MoodRating = () => {
    const handleMoodChange = (rating) => {
      setMoodRating(rating);
      saveToLocalStorage();
    };

    return (
      <div className="mood-rating">
        <h3>{language === 'ru' ? 'Ваше настроение сегодня' : 'Your mood today'}</h3>
        <div className="mood-icons">
          {[1, 2, 3, 4, 5].map(rating => (
            <span
              key={rating}
              className={`mood-icon ${moodRating === rating ? 'selected' : ''}`}
              onClick={() => handleMoodChange(rating)}
            >
              {rating === 1 && '😞'}
              {rating === 2 && '😐'}
              {rating === 3 && '🙂'}
              {rating === 4 && '😊'}
              {rating === 5 && '😍'}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="eva-page" ref={containerRef}>
      {/* Добавляем информационное сообщение для отладки */}
      <div className="debug-info" style={{ position: 'fixed', top: '5px', left: '5px', zIndex: 9999, background: 'rgba(255,255,255,0.8)', padding: '5px', fontSize: '12px', display: 'none' }}>
        isAuthenticated: {String(isAuthenticated)}, loading: {String(authLoading)}
      </div>

      <Navbar />
      <ThemeLanguageSwitcher />

      {animation && (
        <>
          <div className="confetti-container">
            {generateConfetti().map((confetti, index) => React.cloneElement(confetti, {
              key: `confetti-${index}-${Math.random()}`
            }))}
          </div>
          <div className="wish-granted">
            <h3>{language === 'ru' ? 'Желание исполнено!' : 'Wish granted!'}</h3>
          </div>
        </>
      )}

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
          <div className="features-container">
            <h2>{language === 'ru' ? 'Качества Евы' : 'Eva\'s Features'}</h2>
            <div className="features-list">
              {features.map(feature => (
                <FeatureItem key={feature.id} feature={feature} />
              ))}
            </div>

            {/* Форма добавления нового качества */}
            <div className="add-feature-form">
                <input
                  type="text"
                className="feature-input"
                placeholder={language === 'ru' ? 'Добавить новое качество...' : 'Add new feature...'}
                  value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && newFeature?.trim() && addFeature(newFeature)}
              />
                    <button
                className="add-feature-button"
                onClick={() => newFeature?.trim() && addFeature(newFeature)}
              >
                {language === 'ru' ? 'Добавить' : 'Add'}
                    </button>
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

      {/* Кнопка выхода */}
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt /> {language === 'ru' ? 'Выйти' : 'Logout'}
      </button>

      {/* Добавляем индикатор загрузки и сообщение API */}
      {loading && <div className="api-loading">Загрузка данных...</div>}
      {apiMessage && <div className="api-message">{apiMessage}</div>}
      {error && <div className="api-error">{error}</div>}
      {offlineMode && <div className="api-warning">Работа в автономном режиме. Данные сохраняются только локально.</div>}
    </div>
  );
};

export default Eva;