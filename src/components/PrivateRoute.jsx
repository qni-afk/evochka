import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Компонент для защиты маршрутов от неавторизованных пользователей
 * Перенаправляет на страницу входа, если пользователь не авторизован
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  console.log("PrivateRoute: path=", location.pathname, "isAuthenticated=", isAuthenticated, "loading=", loading, "user=", user);

  useEffect(() => {
    // Сохраняем текущий маршрут, чтобы вернуться к нему после входа
    if (!isAuthenticated && !loading) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isAuthenticated, loading, location]);

  // Показываем индикатор загрузки, пока проверяется авторизация
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Проверка авторизации...</p>
      </div>
    );
  }

  // Если пользователь авторизован, показываем защищенный контент
  if (isAuthenticated) {
    return children;
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;