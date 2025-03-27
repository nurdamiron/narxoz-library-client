// src/components/routes/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * Компонент защищенного маршрута, который проверяет аутентификацию пользователя
 * @param {Object} props - Свойства компонента
 * @param {string} props.requiredRole - Роль, необходимая для доступа к маршруту (опционально)
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Показываем индикатор загрузки во время проверки аутентификации
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Проверяем, аутентифицирован ли пользователь
  if (!isAuthenticated) {
    // Перенаправляем на страницу входа и сохраняем место, к которому пытались получить доступ
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуется определенная роль, проверяем, есть ли она у пользователя
  if (requiredRole && user.role !== requiredRole) {
    // У пользователя нет необходимой роли, перенаправляем на домашнюю страницу
    return <Navigate to="/" replace />;
  }

  // Пользователь аутентифицирован и имеет необходимую роль (если требуется), отображаем защищенный маршрут
  return <Outlet />;
};

export default ProtectedRoute;