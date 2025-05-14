import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';
import { normalizeRole } from '../debug-role';

// Создание контекста авторизации
const AuthContext = createContext();

/**
 * Провайдер аутентификации
 * Управляет состоянием аутентификации пользователя
 * 
 * @param {Object} props - Пропсы компонента
 * @param {ReactNode} props.children - Дочерние компоненты
 */
export const AuthProvider = ({ children }) => {
  // Состояние пользователя
  const [user, setUser] = useState(null);
  // Состояние авторизации
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Состояние загрузки
  const [loading, setLoading] = useState(true);
  // Состояние ошибки
  const [error, setError] = useState(null);

  // Очистка ошибки
  const clearError = () => setError(null);

  /**
   * Вход пользователя
   * 
   * @param {Object} credentials - Учетные данные пользователя
   * @param {string} credentials.email - Email пользователя
   * @param {string} credentials.password - Пароль пользователя
   * @param {boolean} credentials.rememberMe - Флаг "запомнить меня"
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      if (response.success) {
        // Ensure role is normalized to lowercase for consistent comparison
        const userData = {
          ...response.data,
          role: normalizeRole(response.data.role)
        };
        
        // Print user data for debugging
        console.log('Login response received:', {
          originalRole: response.data.role,
          normalizedRole: userData.role,
          name: userData.firstName
        });
        
        // Добавляем расширенное логирование для отладки проблем с ролью модератора
        if (userData.role === 'moderator') {
          console.log('%c👨‍💼 Модератор успешно вошел в систему', 'background: #4caf50; color: white; padding: 4px 8px; border-radius: 4px;');
          console.log('Убедитесь, что роль сохранена в нижнем регистре:', userData.role);
        } else if (response.data.role && response.data.role.toLowerCase() === 'moderator') {
          console.warn('%c⚠️ Роль модератора обнаружена, но с неправильным регистром!', 'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px;');
          console.warn('Оригинальная роль:', response.data.role);
          console.warn('Нормализованная роль:', userData.role);
        }
        
        // Extra logging for moderator role normalization
        if (response.data.role && response.data.role.toLowerCase() === 'moderator') {
          console.info('Moderator login detected:', {
            originalRole: response.data.role,
            normalizedRole: userData.role,
            isNormalized: response.data.role === userData.role
          });
        }

        // Сохраняем данные пользователя (без JWT)
        setUser(userData);
        setIsAuthenticated(true);
        
        // Также сохраняем данные пользователя в localStorage для отладки
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Сохраняем учетные данные в сессии, чтобы использовать их при последующих запросах
        sessionStorage.setItem('email', credentials.email);
        sessionStorage.setItem('userPassword', credentials.password);
        
        // Если включено "запомнить меня", сохраняем учетные данные в локальном хранилище
        if (credentials.rememberMe) {
          localStorage.setItem('email', credentials.email);
          localStorage.setItem('userPassword', credentials.password);
        }
      }
      
      return response;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Жүйеге кіру кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Выход пользователя
   */
  const logout = () => {
    // Удаляем учетные данные из хранилищ
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userPassword');
    localStorage.removeItem('email');
    localStorage.removeItem('userPassword');
    
    // Сбрасываем состояние авторизации
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Обновление данных пользователя
   */
  const updateUserData = async () => {
    try {
      setLoading(true);
      
      // Проверяем наличие учетных данных
      const email = sessionStorage.getItem('email') || localStorage.getItem('email');
      const password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
      
      if (!email || !password) {
        setLoading(false);
        return;
      }
      
      // Получаем данные пользователя
      const response = await authService.getCurrentUser({ email, password });
      
      if (response.success) {
        // Ensure role is normalized to lowercase for consistent comparison
        const userData = {
          ...response.data,
          role: normalizeRole(response.data.role)
        };
        
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Если запрос не удался, выходим из системы
        logout();
      }
    } catch (err) {
      console.error('Error updating user data:', err);
      // В случае ошибки выходим из системы
      logout();
    } finally {
      setLoading(false);
    }
  };

  // При первой загрузке проверяем наличие учетных данных
  useEffect(() => {
    const initAuth = async () => {
      const email = sessionStorage.getItem('email') || localStorage.getItem('email');
      const password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
      
      if (email && password) {
        // Если учетные данные есть, пытаемся получить текущего пользователя
        try {
          setLoading(true);
          const response = await authService.getCurrentUser({ email, password });
          
          if (response.success) {
            // Ensure role is normalized to lowercase for consistent comparison
            const userData = {
              ...response.data,
              role: normalizeRole(response.data.role)
            };
            
            // Log user data for debugging
            console.log('User data loaded on init:', {
              originalRole: response.data.role,
              normalizedRole: userData.role,
              name: userData.firstName
            });
            
            // Если успешно получили данные, устанавливаем пользователя
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Если запрос не удался, выходим из системы
            logout();
          }
        } catch (err) {
          console.error('Authentication error:', err);
          // В случае ошибки выходим из системы
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        // Если учетных данных нет, просто заканчиваем загрузку
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Значение контекста
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    updateUserData,
    clearError,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста авторизации
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;