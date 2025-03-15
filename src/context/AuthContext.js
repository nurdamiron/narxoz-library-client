import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Айдар Тестов',
    email: 'aidar@test.com',
    avatar: null,
    phone: '+7 (777) 123-45-67',
    faculty: 'Экономический факультет',
    specialization: 'Финансы и кредит',
    studentId: '2023-1234',
    year: '3 курс',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = async (credentials) => {
    try {
      setLoading(true);
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Простая проверка для тестирования
      if (credentials.email === 'test@test.com' && credentials.password === 'password') {
        setUser({
          name: 'Айдар Тестов',
          email: credentials.email,
          avatar: null,
          phone: '+7 (777) 123-45-67',
          faculty: 'Экономический факультет',
          specialization: 'Финансы и кредит',
          studentId: '2023-1234',
          year: '3 курс',
        });
        setIsAuthenticated(true);
        setError(null);
        return user;
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (err) {
      setError(err.message || 'Ошибка входа');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Просто устанавливаем пользователя из полученных данных
      setUser({
        ...userData,
        avatar: null
      });
      setIsAuthenticated(true);
      setError(null);
      return userData;
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};