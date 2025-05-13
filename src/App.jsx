import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import MyEventsPage from './pages/MyEventsPage';

// Импорт компонентов админ-панели
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import AdminBooksPage from './pages/admin/BooksPage';
import BorrowsPage from './pages/admin/BorrowsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import AdminEventsPage from './pages/admin/EventsPage';
import CreateEventPage from './pages/admin/CreateEventPage';
import EditEventPage from './pages/admin/EditEventPage';
import EventRegistrationsPage from './pages/admin/EventRegistrationsPage';
import { AdminLayout } from './components/admin/common';

// Импорт компонента защищенного маршрута
import ProtectedRoute from './components/routes/ProtectedRoute';

// Импорт Layout компонента - используем только ОДИН компонент макета
import Layout from './components/layout/Layout';

// Импорт наших контекстов
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';

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
    console.log('Route changed to:', pathname);
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
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <ScrollToTop />
              <Routes>
                <Route element={<Layout />}>
                  {/* Публичные маршруты */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/books" element={<BooksPage />} />
                  <Route path="/books/:id" element={<BookDetailsPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailsPage />} />
                  
                  {/* Защищенные маршруты для обычных пользователей */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/bookmarks" element={<BookmarksPage />} />
                    <Route path="/borrows" element={<BorrowHistoryPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/my-events" element={<MyEventsPage />} />
                  </Route>
                  
                  {/* Маршруты администратора - упрощенная структура без вложенных элементов */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole={['admin', 'moderator']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={
                      <ProtectedRoute requiredRole="admin">
                        <UsersPage />
                      </ProtectedRoute>
                    } />
                    <Route path="books" element={<AdminBooksPage />} />
                    <Route path="borrows" element={<BorrowsPage />} />
                    <Route path="categories" element={
                      <ProtectedRoute requiredRole="admin">
                        <CategoriesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="events" element={<AdminEventsPage />} />
                    <Route path="events/create" element={<CreateEventPage />} />
                    <Route path="events/edit/:id" element={<EditEventPage />} />
                    <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
                  </Route>
                  
                  {/* Маршрут по умолчанию (404) */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;