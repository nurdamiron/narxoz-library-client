// src/routes.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Импортируем компоненты страниц
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { RegisterForm } from './components/auth/RegisterForm/barrel';

import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import BookmarksPage from './pages/BookmarksPage';
import BorrowHistoryPage from './pages/BorrowHistoryPage';

// Импортируем страницы администратора
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import AdminBooksPage from './pages/admin/BooksPage';
import BorrowsPage from './pages/admin/BorrowsPage';
import CategoriesPage from './pages/admin/CategoriesPage';

// Импортируем защищенный маршрут
import ProtectedRoute from './components/routes/ProtectedRoute';

// Определяем маршруты
const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterForm />,
  },
  {
    path: '/books',
    element: <BooksPage />,
  },
  {
    path: '/books/:id',
    element: <BookDetailsPage />,
  },
  // Защищенные маршруты (требуют авторизации)
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/bookmarks',
        element: <BookmarksPage />,
      },
      {
        path: '/borrows',
        element: <BorrowHistoryPage />,
      },
      {
        path: '/notifications',
        element: <NotificationsPage />,
      },
    ],
  },
  // Маршруты администратора (требуют роли admin)
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          {
            path: '',
            element: <AdminDashboard />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'books',
            element: <AdminBooksPage />,
          },
          {
            path: 'borrows',
            element: <BorrowsPage />,
          },
          {
            path: 'categories',
            element: <CategoriesPage />,
          },
        ],
      },
    ],
  },
  // Обработка несуществующих маршрутов
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default routes;