import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import MainLayout from './components/layout/MainLayout';

// Контекст аутентификации
const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState({
    name: 'Айдар Тестов',
    email: 'aidar@test.com',
    avatar: null,
  });
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  
  const value = {
    user,
    isAuthenticated,
    login: () => setIsAuthenticated(true),
    logout: () => setIsAuthenticated(false)
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Простые компоненты-заглушки для страниц
const HomePage = () => <div>Главная страница</div>;
const BooksPage = () => <div>Страница каталога книг</div>;
const BookDetailsPage = () => <div>Детальная страница книги</div>;
const LoginPage = () => <div>Страница входа</div>;
const RegisterPage = () => <div>Страница регистрации</div>;
const ProfilePage = () => <div>Страница профиля</div>;
const BorrowHistoryPage = () => <div>История заимствований</div>;
const AboutPage = () => <div>О библиотеке</div>;

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
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
  );
}

export default App;