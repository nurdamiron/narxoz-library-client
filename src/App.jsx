import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BorrowHistoryPage from './pages/BorrowHistoryPage';
import AboutPage from './pages/AboutPage';
import { AuthProvider } from './context/AuthContext';
import theme from './styles/theme';

/**
 * Негізгі қолданба компоненті
 * Бұл компонент бүкіл қолданбаны құрылымдайды:
 * - Тақырыпты баптау (ThemeProvider арқылы)
 * - Аутентификация провайдерін орнату
 * - Беттер маршрутизациясын конфигурациялау
 * 
 * Барлық беттер MainLayout ішінде көрсетіледі, бұл
 * біркелкі навигация мен футерді қамтамасыз етеді.
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Аутентификация контекстін орнату */}
      <AuthProvider>
        {/* Негізгі стильдерді қалпына келтіру */}
        <CssBaseline />
        {/* Қолданба маршруттары */}
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:id" element={<BookDetailsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="history" element={<BorrowHistoryPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;