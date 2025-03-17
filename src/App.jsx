import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Box, 
  CircularProgress,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BorrowHistoryPage from './pages/BorrowHistoryPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import lightTheme from './styles/theme';
import ScrollToTop from './components/common/ScrollToTop';

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
  const location = useLocation();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Қосымша күйлері
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' ? true : false
  );
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  // Қараңғы түс режимін ауыстыру
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    showAlert(newMode ? 'Темная тема включена' : 'Темная тема отключена', 'success');
  };
  
  // Хабарландыру көрсету
  const showAlert = (message, severity = 'info') => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };
  
  // Хабарландыруды жабу
  const handleAlertClose = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };
  
  // Тақырыпты құру (жарық немесе қараңғы)
  const theme = React.useMemo(() => {
    // Негізгі тақырып көшірмесін алу
    const baseTheme = { ...lightTheme };
    
    // Егер қараңғы режим қосылған болса
    if (darkMode) {
      baseTheme.palette.mode = 'dark';
      
      // Қараңғы режим үшін түстерді өзгерту
      baseTheme.palette.background.default = '#121212';
      baseTheme.palette.background.paper = '#1e1e1e';
      baseTheme.palette.text.primary = 'rgba(255, 255, 255, 0.87)';
      baseTheme.palette.text.secondary = 'rgba(255, 255, 255, 0.6)';
    }
    
    return createTheme(baseTheme);
  }, [darkMode]);
  
  // Қолданба жүктелгенде
  useEffect(() => {
    // Жүктелуді имитациялау
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    // Компонент өшкенде таймерді тазалау
    return () => clearTimeout(timer);
  }, []);
  
  // Беттер арасында ауысқанда скроллды жоғарыға ауыстыру
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Қолданба әлі жүктелмеген жағдайда
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      {/* Аутентификация контекстін орнату */}
      <AuthProvider>
        {/* Негізгі стильдерді қалпына келтіру */}
        <CssBaseline />
        
        {/* Беттер арасында ауысқанда скроллды жоғарыға қайтаратын компонент */}
        <ScrollToTop />
        
        {/* Қолданба маршруттары */}
        <Routes>
          <Route path="/" element={
            <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }>
            <Route index element={<HomePage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:id" element={<BookDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="history" element={<BorrowHistoryPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Layout-сыз беттер */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Routes>
        
        {/* Хабарландыру компоненті */}
        <Snackbar
          open={alert.open}
          autoHideDuration={5000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleAlertClose} 
            severity={alert.severity} 
            variant="filled"
            elevation={6}
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;