import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

// Импорт компонентов страниц
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import BookmarksPage from './pages/BookmarksPage';
import BorrowHistoryPage from './pages/BorrowHistoryPage';

// Импорт компонента защищенного маршрута
import ProtectedRoute from './components/routes/ProtectedRoute';

// Импорт Layout компонента
import Layout from './components/layout/Layout';

// Импорт наших контекстов
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Создаем тему Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    error: {
      main: '#f44336',
      lighter: '#ffebee'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// Компонент для отслеживания изменения маршрутов (для прокрутки вверх)
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />
                
                {/* Защищенные маршруты */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/borrows" element={<BorrowHistoryPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
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