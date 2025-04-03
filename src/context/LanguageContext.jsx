import React, { createContext, useState, useContext, useEffect } from 'react';

// Словари переводов
const translations = {
  // Общие фразы
  common: {
    en: {
      home: "Home",
      gallery: "Gallery",
      games: "Games",
      eva: "Eva",
      loading: "Loading...",
      startGame: "Start game",
      seeMore: "See more",
      viewMore: "View more photos",
      withLove: "With love forever",
      changeTheme: "Change theme",
      saveChanges: "Save changes",
      cancel: "Cancel",
      add: "Add",
      logout: "Logout"
    },
    ru: {
      home: "Главная",
      gallery: "Галерея",
      games: "Игры",
      eva: "Ева",
      loading: "Загрузка...",
      startGame: "Начать игру",
      seeMore: "Посмотреть ещё",
      viewMore: "Посмотреть больше фотографий",
      withLove: "С любовью навсегда",
      changeTheme: "Изменить тему",
      saveChanges: "Сохранить изменения",
      cancel: "Отмена",
      add: "Добавить",
      logout: "Выйти"
    }
  },

  // Страница Eva
  eva: {
    en: {
      mySweetGirl: "My sweet girl",
      moodToday: "Mood today:",
      gallery: "Gallery",
      wishes: "Wishes",
      features: "Features",
      compliments: "Compliments",
      ourMemories: "Our Memories",
      wishList: "Wish List",
      addNewWish: "Add a new wish...",
      featureList: "Feature List",
      filterByPriority: "Filter by priority:",
      all: "All",
      high: "High",
      medium: "Medium",
      low: "Low",
      addNewActivity: "Add a new fun activity...",
      funActivitiesTogether: "Fun Activities Together",
      funActivitiesDescription: "Create a list of fun activities we can do together. Set priorities, mark your favorites, and let's make memories!",
      newCompliment: "New Compliment",
      loveNote: "You are the best thing that has ever happened to me. Every day with you is a little miracle."
    },
    ru: {
      mySweetGirl: "Моя сладкая девочка",
      moodToday: "Настроение сегодня:",
      gallery: "Галерея",
      wishes: "Желания",
      features: "Активности",
      compliments: "Комплименты",
      ourMemories: "Наши воспоминания",
      wishList: "Список желаний",
      addNewWish: "Добавить новое желание...",
      featureList: "Список активностей",
      filterByPriority: "Фильтр по приоритету:",
      all: "Все",
      high: "Высокий",
      medium: "Средний",
      low: "Низкий",
      addNewActivity: "Добавить новую активность...",
      funActivitiesTogether: "Весёлые занятия вместе",
      funActivitiesDescription: "Создайте список весёлых занятий, которые мы можем делать вместе. Установите приоритеты, отметьте любимые и давайте создадим воспоминания!",
      newCompliment: "Новый комплимент",
      loveNote: "Ты самое лучшее, что случилось в моей жизни. Каждый день с тобой — это маленькое чудо."
    }
  },

  // Страница Games
  games: {
    en: {
      gardenGame: "Mini-game 'Gardener'",
      gardenDescription: "Combine identical plants to create new ones and earn points!",
      notEnoughEnergy: "Not enough energy! Wait for recovery.",
      noFreeSpace: "No free space! Combine elements.",
      energyRecovered: "Energy recovered!",
      dailyEnergy: "Daily Energy",
      shop: "Shop",
      score: "Score",
      energy: "Energy"
    },
    ru: {
      gardenGame: "Мини-игра 'Садовник'",
      gardenDescription: "Объединяйте одинаковые растения, чтобы создавать новые и зарабатывать очки!",
      notEnoughEnergy: "Недостаточно энергии! Подождите восстановления.",
      noFreeSpace: "Нет свободного места! Объедините элементы.",
      energyRecovered: "Энергия восстановлена!",
      dailyEnergy: "Ежедневная энергия",
      shop: "Магазин",
      score: "Очки",
      energy: "Энергия"
    }
  },

  // Страница Gallery
  gallery: {
    en: {
      galleryTitle: "Gallery",
      loadingPhotos: "Loading photos...",
      loadingVideos: "Loading videos...",
      filterAll: "All",
      filterFunny: "Funny",
      filterCute: "Cute",
      filterCool: "Cool",
      viewMode: "View Mode",
      grid: "Grid",
      threeD: "3D"
    },
    ru: {
      galleryTitle: "Галерея",
      loadingPhotos: "Загрузка фото...",
      loadingVideos: "Загрузка видео...",
      filterAll: "Все",
      filterFunny: "Смешные",
      filterCute: "Милые",
      filterCool: "Крутые",
      viewMode: "Режим просмотра",
      grid: "Сетка",
      threeD: "3D"
    }
  },

  // Страница Home
  home: {
    en: {
      aboutYou: "about you",
      happiness: "My happiness",
      dream: "My dream",
      comfort: "My comfort",
      meaning: "You mean so much to me",
      sweet: "You're sweet",
      happinessText: "I'm very lucky that you chose me.",
      dreamText: "with you at ease.",
      comfortText: "i forget all my problems with you.",
      meaningText: "when I'm with you, i feel good.",
      sweetText: "you're very sexy.",
      togetherFor: "We've been together for:",
      years: "years",
      days: "days",
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds"
    },
    ru: {
      aboutYou: "о тебе",
      happiness: "Моё счастье",
      dream: "Моя мечта",
      comfort: "Мой комфорт",
      meaning: "Ты так много значишь для меня",
      sweet: "Ты прекрасна",
      happinessText: "Мне очень повезло, что ты выбрала меня.",
      dreamText: "с тобой мне спокойно.",
      comfortText: "с тобой я забываю все проблемы.",
      meaningText: "когда я с тобой, мне хорошо.",
      sweetText: "ты очень сексуальная.",
      togetherFor: "Мы вместе уже:",
      years: "год",
      days: "дней",
      hours: "часов",
      minutes: "минут",
      seconds: "секунд"
    }
  },

  // Страница логина
  login: {
    ru: {
      title: 'Авторизация',
      username: 'Логин',
      password: 'Пароль',
      login: 'Войти',
      passwordHint: 'Подсказка: то, что чувствуешь к Еве',
      errorMessage: 'Неверный логин или пароль'
    },
    en: {
      title: 'Authorization',
      username: 'Username',
      password: 'Password',
      login: 'Log In',
      passwordHint: 'Hint: what you feel for Eva',
      errorMessage: 'Invalid username or password'
    }
  }
};

// Создаем контекст языка
const LanguageContext = createContext();

// Провайдер контекста
export const LanguageProvider = ({ children }) => {
  // Загружаем сохраненный язык из localStorage или используем русский по умолчанию
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    return savedLanguage || 'ru';
  });

  // Функция для переключения языка
  const toggleLanguage = () => {
    setLanguage(prevLang => {
      const newLang = prevLang === 'ru' ? 'en' : 'ru';
      localStorage.setItem('appLanguage', newLang);
      return newLang;
    });
  };

  // Функция для получения перевода
  const t = (section, key) => {
    if (!translations[section]) {
      console.warn(`Translation section '${section}' not found`);
      return key;
    }

    if (!translations[section][language]) {
      console.warn(`Language '${language}' not found in section '${section}'`);
      return key;
    }

    if (!translations[section][language][key]) {
      console.warn(`Key '${key}' not found in '${section}' section for language '${language}'`);
      return key;
    }

    return translations[section][language][key];
  };

  // Сохраняем язык в localStorage при его изменении
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  // Значения, предоставляемые контекстом
  const contextValue = {
    language,
    toggleLanguage,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования контекста языка
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;