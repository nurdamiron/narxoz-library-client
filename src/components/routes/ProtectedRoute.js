// src/components/routes/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { userHasRole, logUserRoleInfo } from '../../debug-role';

/**
 * Компонент защищенного маршрута, который проверяет аутентификацию пользователя
 * @param {Object} props - Свойства компонента
 * @param {string|string[]} props.requiredRole - Роль или массив ролей, необходимых для доступа к маршруту (опционально)
 * @param {React.ReactNode} props.children - Дочерние компоненты (опционально)
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Для отладки
  console.log('ProtectedRoute check:', { 
    isAuthenticated, 
    userRole: user?.role, 
    userRoleLowercase: user?.role?.toLowerCase(),
    requiredRole, 
    path: location.pathname,
    hasChildren: !!children,
    hasRequiredRole: userHasRole(user, requiredRole)
  });
  
  // Log detailed user role information for debugging
  logUserRoleInfo(user);

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

  // Если требуется определенная роль или массив ролей, проверяем доступ пользователя
  if (requiredRole) {
    // Проверяем, соответствует ли роль пользователя требуемой роли (с учетом регистра)
    const hasAccess = userHasRole(user, requiredRole);

    if (!hasAccess) {
      // У пользователя нет необходимой роли
      console.log(`Пользователь с ролью ${user?.role} пытается получить доступ к маршруту, требующему роль ${Array.isArray(requiredRole) ? requiredRole.join(',') : requiredRole}`);
      
      // Проверяем, является ли пользователь модератором и пытается получить доступ к административным разделам
      const userRoleLowercase = user?.role?.toLowerCase() || '';
      console.log('Access check details:', { userRoleLowercase, currentPath: location.pathname });
      
      // Специальная проверка для роли модератора - используем проверку в нижнем регистре для надежности
      const isUserModerator = userRoleLowercase === 'moderator';
      
      // Расширенное логирование для диагностики
      console.log('%c🔎 Проверка модератора в ProtectedRoute', 'background: #2196f3; color: white; padding: 2px 6px; border-radius: 4px;', {
        userRole: user?.role,
        userRoleLowercase,
        isUserModerator,
        locationPathname: location.pathname,
        hasCapitalizationIssue: isUserModerator && user?.role !== 'moderator'
      });
      
      // Обнаружение проблем с регистром роли
      if (isUserModerator && user?.role !== 'moderator') {
        console.warn('%c⚠️ Обнаружена проблема с регистром роли модератора!', 'background: #ff9800; color: white; padding: 2px 6px; border-radius: 4px;');
        console.warn(`Текущая роль: "${user?.role}", ожидается: "moderator"`);
      }
      
      // Если модератор пытается получить доступ к админ-панели
      if (isUserModerator && location.pathname.startsWith('/admin')) {
        const forbiddenPaths = ['/admin/users']; // Разделы, запрещенные для модератора
        
        if (forbiddenPaths.some(forbiddenPath => location.pathname.startsWith(forbiddenPath))) {
          console.log('%c🚫 Модератор пытается получить доступ к запрещенному разделу', 'background: #f44336; color: white; padding: 2px 6px; border-radius: 4px;');
          // Перенаправляем на разрешенную страницу
          return <Navigate to="/admin/books" replace />;
        } else {
          // Модератор пытается получить доступ к разрешенной административной странице
          // Предоставляем доступ независимо от результата предыдущей проверки
          console.log('%c✅ Модератор получает доступ к разрешенному разделу администратора', 'background: #4caf50; color: white; padding: 2px 6px; border-radius: 4px;');        
          return children ? children : <Outlet />;
        }
      }
      
      console.log('Перенаправление на главную страницу из-за несоответствия роли');      
      // Для других случаев (когда роли не совпадают) перенаправляем на домашнюю страницу
      return <Navigate to="/" replace />;
    }
  }

  // Пользователь аутентифицирован и имеет необходимую роль, отображаем защищенный маршрут
  console.log('Доступ разрешен, пользователь аутентифицирован и имеет необходимую роль');
  
  // Возвращаем детей, если они переданы, иначе используем Outlet для вложенных маршрутов
  return children ? children : <Outlet />;
};

export default ProtectedRoute;