import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Компонент для защиты маршрутов, требующих аутентификации
 * Если пользователь не аутентифицирован, перенаправляет на страницу входа
 */
const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log("PrivateRoute: isAuthenticated =", isAuthenticated, "loading =", loading);

  // Если идет процесс проверки аутентификации, отображаем индикатор загрузки
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    console.log("PrivateRoute: перенаправление на /login");
    return <Navigate to="/login" replace />;
  }

  // Если пользователь аутентифицирован, рендерим компонент
  console.log("PrivateRoute: рендеринг защищенного компонента");
  return element;
};

export default PrivateRoute;