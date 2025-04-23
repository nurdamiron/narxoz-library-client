import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

// Импорт компонентов страниц
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
// Удаляем импорт компонента регистрации
// import { RegisterForm } from './components/auth/RegisterForm/barrel';

import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import BookmarksPage from './pages/BookmarksPage';
import BorrowHistoryPage from './pages/BorrowHistoryPage';

// Импорт компонентов админ-панели
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import AdminBooksPage from './pages/admin/BooksPage';
import BorrowsPage from './pages/admin/BorrowsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import { AdminLayout } from './components/admin/common';

// Импорт компонента защищенного маршрута
import ProtectedRoute from './components/routes/ProtectedRoute';

// Импорт Layout компонента - используем только ОДИН компонент макета
import Layout from './components/layout/Layout';

// Импорт наших контекстов
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Импорт обновленной темы
import theme from './styles/theme';

/**
 * Компонент для отслеживания изменения маршрутов (для прокрутки вверх)
 * Автоматически прокручивает страницу вверх при изменении маршрута
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * Основной компонент приложения, который настраивает:
 * - Тему оформления через ThemeProvider
 * - Базовые стили через CssBaseline
 * - Систему уведомлений через SnackbarProvider
 * - Контексты авторизации и уведомлений
 * - Маршрутизацию через Routes
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{ 
          vertical: 'bottom', 
          horizontal: 'center' 
        }}
      >
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            <Layout>
              <Routes>
                {/* Публичные маршруты */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Удаляем маршрут регистрации */}
                {/* <Route path="/register" element={<RegisterForm />} /> */}
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />
                
                {/* Защищенные маршруты */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/borrows" element={<BorrowHistoryPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                </Route>
                
                {/* Маршруты администратора */}
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="books" element={<AdminBooksPage />} />
                    <Route path="borrows" element={<BorrowsPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                  </Route>
                </Route>
                
                {/* Маршрут по умолчанию (404) */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Layout>
          </ToastProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;