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
    },
    vi: {
      home: "Trang chủ",
      gallery: "Thư viện",
      games: "Trò chơi",
      eva: "Eva",
      loading: "Đang tải...",
      startGame: "Bắt đầu trò chơi",
      seeMore: "Xem thêm",
      viewMore: "Xem thêm ảnh",
      withLove: "Với tình yêu mãi mãi",
      changeTheme: "Thay đổi chủ đề",
      saveChanges: "Lưu thay đổi",
      cancel: "Hủy bỏ",
      add: "Thêm",
      logout: "Đăng xuất"
    }
  },

  // Страница Eva
  eva: {
    en: {
      mySweetGirl: "My Sweet Girl",
      moodToday: "Mood today:",
      gallery: "Gallery",
      wishes: "Wishes",
      features: "Features",
      compliments: "Compliments",
      memories: "Memories",
      achievements: "Achievements",
      addFeature: "Add a new feature...",
      addWish: "Add a new wish...",
      yourFeatures: "Your Wonderful Features",
      yourWishes: "Your Little Wishes",
      newCompliment: "New Compliment",
      loveNote: "Every day with you is a special gift. I love you more than words can say.",
      ourMemories: "Our Memories",
      ourAchievements: "Our Achievements",
      loadingAchievements: "Loading achievements...",
      noAchievements: "No achievements unlocked yet."
    },
    ru: {
      mySweetGirl: "Моя Милая Девочка",
      moodToday: "Настроение сегодня:",
      gallery: "Галерея",
      wishes: "Желания",
      features: "Особенности",
      compliments: "Комплименты",
      memories: "Воспоминания",
      achievements: "Достижения",
      addFeature: "Добавить новую особенность...",
      addWish: "Добавить новое желание...",
      yourFeatures: "Твои Замечательные Особенности",
      yourWishes: "Твои Маленькие Желания",
      newCompliment: "Новый Комплимент",
      loveNote: "Каждый день с тобой - особенный подарок. Люблю тебя больше, чем можно выразить словами.",
      ourMemories: "Наши Воспоминания",
      ourAchievements: "Наши Достижения",
      loadingAchievements: "Загрузка достижений...",
      noAchievements: "Достижения пока не разблокированы."
    },
    vi: {
      mySweetGirl: "Cô Gái Ngọt Ngào Của Tôi",
      moodToday: "Tâm trạng hôm nay:",
      gallery: "Thư viện",
      wishes: "Mong ước",
      features: "Đặc điểm",
      compliments: "Lời khen",
      memories: "Kỷ niệm",
      achievements: "Thành tích",
      addFeature: "Thêm đặc điểm mới...",
      addWish: "Thêm ước muốn mới...",
      yourFeatures: "Những Đặc Điểm Tuyệt Vời Của Bạn",
      yourWishes: "Những Ước Muốn Nhỏ Của Bạn",
      newCompliment: "Lời Khen Mới",
      loveNote: "Mỗi ngày bên em là một món quà đặc biệt. Anh yêu em nhiều hơn những gì anh có thể nói.",
      ourMemories: "Kỷ Niệm Của Chúng Ta",
      ourAchievements: "Thành Tích Của Chúng Ta",
      loadingAchievements: "Đang tải thành tích...",
      noAchievements: "Chưa có thành tích nào được mở khóa."
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
    },
    vi: {
      gardenGame: "Trò chơi nhỏ 'Người làm vườn'",
      gardenDescription: "Kết hợp các cây giống nhau để tạo ra cây mới và kiếm điểm!",
      notEnoughEnergy: "Không đủ năng lượng! Chờ hồi phục.",
      noFreeSpace: "Không có chỗ trống! Kết hợp các phần tử.",
      energyRecovered: "Năng lượng đã hồi phục!",
      dailyEnergy: "Năng lượng hàng ngày",
      shop: "Cửa hàng",
      score: "Điểm số",
      energy: "Năng lượng"
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
    },
    vi: {
      galleryTitle: "Thư viện",
      loadingPhotos: "Đang tải ảnh...",
      loadingVideos: "Đang tải video...",
      filterAll: "Tất cả",
      filterFunny: "Hài hước",
      filterCute: "Dễ thương",
      filterCool: "Thật chất",
      viewMode: "Chế độ xem",
      grid: "Lưới",
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
    },
    vi: {
      aboutYou: "về em",
      happiness: "Niềm hạnh phúc của anh",
      dream: "Ước mơ của anh",
      comfort: "Sự thoải mái của anh",
      meaning: "Em có ý nghĩa rất lớn với anh",
      sweet: "Em thật ngọt ngào",
      happinessText: "Anh thật may mắn khi em đã chọn anh.",
      dreamText: "với em anh thật thoải mái.",
      comfortText: "anh quên đi mọi vấn đề khi ở bên em.",
      meaningText: "khi anh ở bên em, anh cảm thấy rất tốt.",
      sweetText: "em rất quyến rũ.",
      togetherFor: "Chúng ta đã bên nhau:",
      years: "năm",
      days: "ngày",
      hours: "giờ",
      minutes: "phút",
      seconds: "giây"
    }
  },

  // Страница логина
  login: {
    en: {
      title: "Login",
      subtitle: "Welcome back! Please log in to your account.",
      emailPlaceholder: "Username",
      passwordPlaceholder: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      loginButton: "Log In",
      noAccount: "Don't have an account?",
      registerLink: "Register",
      termsText: "By logging in, you agree to our",
      termsLink: "Terms & Privacy",
      allFieldsRequired: "All fields are required",
      invalidCredentials: "Invalid username or password",
      serverError: "Server error. Please try again later."
    },
    ru: {
      title: "Вход",
      subtitle: "С возвращением! Пожалуйста, войдите в свой аккаунт.",
      emailPlaceholder: "Имя пользователя",
      passwordPlaceholder: "Пароль",
      rememberMe: "Запомнить меня",
      forgotPassword: "Забыли пароль?",
      loginButton: "Войти",
      noAccount: "Нет аккаунта?",
      registerLink: "Зарегистрироваться",
      termsText: "Входя, вы соглашаетесь с нашими",
      termsLink: "Условиями и политикой конфиденциальности",
      allFieldsRequired: "Все поля обязательны",
      invalidCredentials: "Неверное имя пользователя или пароль",
      serverError: "Ошибка сервера. Пожалуйста, попробуйте позже."
    },
    vi: {
      title: "Đăng nhập",
      subtitle: "Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.",
      emailPlaceholder: "Tên người dùng",
      passwordPlaceholder: "Mật khẩu",
      rememberMe: "Ghi nhớ tôi",
      forgotPassword: "Quên mật khẩu?",
      loginButton: "Đăng nhập",
      noAccount: "Chưa có tài khoản?",
      registerLink: "Đăng ký",
      termsText: "Bằng cách đăng nhập, bạn đồng ý với",
      termsLink: "Điều khoản & Quyền riêng tư",
      allFieldsRequired: "Tất cả các trường là bắt buộc",
      invalidCredentials: "Tên người dùng hoặc mật khẩu không hợp lệ",
      serverError: "Lỗi máy chủ. Vui lòng thử lại sau."
    }
  },

  // Навигация
  navbar: {
    home: 'Главная',
    gallery: 'Галерея',
    games: 'Игры',
    voice: 'Голос',
    circles: 'Кружочки',
    profile: 'Профиль',
    login: 'Войти',
    logout: 'Выйти',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
  },
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

  // Функция для переключения языка циклически: ru -> en -> vi -> ru
  const toggleLanguage = () => {
    setLanguage(prevLang => {
      let newLang;
      if (prevLang === 'ru') {
        newLang = 'en';
      } else if (prevLang === 'en') {
        newLang = 'vi';
      } else {
        newLang = 'ru';
      }
      localStorage.setItem('appLanguage', newLang);
      return newLang;
    });
  };

  // Функция для установки конкретного языка
  const setSpecificLanguage = (lang) => {
    if (['ru', 'en', 'vi'].includes(lang)) {
      setLanguage(lang);
      localStorage.setItem('appLanguage', lang);
    } else {
      console.warn(`Unsupported language: ${lang}`);
    }
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
    setSpecificLanguage,
    t,
    availableLanguages: ['ru', 'en', 'vi']
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