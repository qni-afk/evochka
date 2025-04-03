// Словарь переводов для новых элементов
const customTranslations = {
  en: {
    invalid_code: "Invalid code! Try again.",
    theme_switch: "Toggle light/dark mode",
    language_switch: "Switch language",
    enter_secret_code: "Enter secret code",
    enter_code: "Enter code",
    matrix_activated: "Matrix effect activated!",
    snow_activated: "Snow effect activated!",
    stars_activated: "Stars effect activated!",
    magic_cursor_activated: "Magic cursor activated!",
    rain_activated: "Rain effect activated!",
    all_effects_disabled: "All effects disabled!",
    code_activated: "Code activated"
  },
  ru: {
    invalid_code: "Неверный код! Попробуйте еще раз.",
    theme_switch: "Переключить светлую/темную тему",
    language_switch: "Сменить язык",
    enter_secret_code: "Ввести секретный код",
    enter_code: "Введите код",
    matrix_activated: "Эффект матрицы активирован!",
    snow_activated: "Снежный эффект активирован!",
    stars_activated: "Звездное небо активировано!",
    magic_cursor_activated: "Магический курсор активирован!",
    rain_activated: "Эффект дождя активирован!",
    all_effects_disabled: "Все эффекты отключены!",
    code_activated: "Код активирован"
  }
};

// Функция перевода, использующая кастомные переводы
const translator = (key, language) => {
  // Проверяем есть ли перевод в кастомном словаре
  if (customTranslations[language] && customTranslations[language][key]) {
    return customTranslations[language][key];
  }

  // Если перевода нет в кастомном словаре, возвращаем ключ
  return key;
};

export default translator;