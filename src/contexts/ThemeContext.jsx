import React, { createContext, useState, useEffect } from 'react';

// Создаем контекст темы
const ThemeContext = createContext();

// Провайдер контекста
export const ThemeProvider = ({ children }) => {
  // Загружаем сохраненную тему из localStorage или используем светлую по умолчанию
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true';
  });

  // Функция для переключения темы
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  // Применяем тему к body при изменении
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Сохраняем в localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Значения, предоставляемые контекстом
  const contextValue = {
    darkMode,
    toggleDarkMode,
    setDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };