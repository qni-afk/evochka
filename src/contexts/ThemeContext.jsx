import React, { createContext, useState, useEffect } from 'react';

// Create a theme context
export const ThemeContext = createContext();

// Context provider
export const ThemeProvider = ({ children }) => {
  // Load saved theme mode from localStorage or use light theme by default
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Function to toggle theme
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Save theme mode to localStorage when it changes and apply to document
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));

    // Apply dark mode class to the entire document
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    }

    // Apply dark mode class to app-content as well (for legacy compatibility)
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      if (darkMode) {
        appContent.classList.add('dark-mode');
      } else {
        appContent.classList.remove('dark-mode');
      }
    }
  }, [darkMode]);

  // Values provided by the context
  const contextValue = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;