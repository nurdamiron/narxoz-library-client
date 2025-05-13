// src/components/routes/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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
    requiredRole, 
    path: location.pathname,
    hasChildren: !!children 
  });

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
    // Проверяем, соответствует ли роль пользователя требуемой роли
    const hasAccess = Array.isArray(requiredRole) 
      ? requiredRole.includes(user.role) 
      : user.role === requiredRole;

    if (!hasAccess) {
      // У пользователя нет необходимой роли
      console.log(`Пользователь с ролью ${user.role} пытается получить доступ к маршруту, требующему роль ${Array.isArray(requiredRole) ? requiredRole.join(',') : requiredRole}`);
      
      // Если требуется роль admin (или массив с admin), но у пользователя роль moderator
      if ((requiredRole === 'admin' || (Array.isArray(requiredRole) && requiredRole.includes('admin'))) && user.role === 'moderator') {
        // Проверяем, пытается ли модератор получить доступ к разделам, которые ему запрещены
        const path = location.pathname;
        const forbiddenPaths = ['/admin/users', '/admin/categories'];
        
        if (forbiddenPaths.some(forbiddenPath => path.startsWith(forbiddenPath))) {
          console.log('Модератор пытается получить доступ к запрещенному разделу');
          // Перенаправляем на разрешенную страницу
          return <Navigate to="/admin/books" replace />;
        }
        
        console.log('Модератор получает доступ к разрешенному разделу');
        // К разрешенным разделам доступ разрешен
        return children ? children : <Outlet />;
      }
      
      // Если требуется роль moderator, но у пользователя роль admin, разрешаем доступ
      if ((requiredRole === 'moderator' || (Array.isArray(requiredRole) && requiredRole.includes('moderator'))) && user.role === 'admin') {
        console.log('Админ получает доступ к разделам модератора');
        return children ? children : <Outlet />;
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