import React, { createContext, useState } from 'react';

/**
 * AuthContext - аутентификация контексті
 * 
 * Бұл контекст пайдаланушының аутентификация күйін және оған қатысты функцияларды
 * барлық қосымша компоненттеріне қол жетімді етеді. Бұл React Context API арқылы жүзеге асырылады.
 * 
 * Контекст келесі мәліметтерді сақтайды және ұсынады:
 * - user: Аутентификацияланған пайдаланушы туралы ақпарат
 * - loading: Аутентификация процесінің жүктелу күйі
 * - error: Аутентификация қатесі (егер болса)
 * - isAuthenticated: Пайдаланушының аутентификацияланған/аутентификацияланбаған күйі
 * - login: Жүйеге кіру функциясы
 * - register: Тіркелу функциясы
 * - logout: Жүйеден шығу функциясы
 */
export const AuthContext = createContext();

/**
 * AuthProvider компоненті - аутентификация контекстін ұсынады
 * 
 * Бұл компонент AuthContext мәліметтерін басқаратын және оларды барлық бала 
 * компоненттерге ұсынатын провайдер функциясын атқарады.
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {React.ReactNode} props.children - Бала компоненттер
 */
export const AuthProvider = ({ children }) => {
  /**
   * Пайдаланушы туралы ақпарат күйі
   * 
   * Бұл күй пайдаланушы туралы барлық мәліметтерді сақтайды:
   * - name: Пайдаланушы аты-жөні
   * - email: Электрондық пошта
   * - avatar: Профиль суреті (аватар)
   * - phone: Телефон нөмірі
   * - faculty: Факультет
   * - specialization: Мамандық
   * - studentId: Студенттік билет/ID нөмірі
   * - year: Оқу курсы
   */
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
  
  // Жүктелу күйі (сұрау жіберу немесе күту кезінде)
  const [loading, setLoading] = useState(false);
  
  // Қате туралы ақпарат күйі
  const [error, setError] = useState(null);
  
  // Пайдаланушының аутентификацияланған күйі
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  /**
   * Жүйеге кіру функциясы
   * 
   * @param {Object} credentials - Кіру деректемелері
   * @param {string} credentials.email - Пайдаланушы электрондық поштасы
   * @param {string} credentials.password - Пайдаланушы құпия сөзі
   * @returns {Promise<Object>} - Пайдаланушы объектісі (жетістік жағдайында)
   * @throws {Error} - Кіру қатесі
   */
  const login = async (credentials) => {
    try {
      setLoading(true); // Жүктелу күйін қосу
      
      // Желі кідірісін имитациялау (шынайы қосымшада API сұрауы болады)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Тестілік тексеру - шынайы қосымшада API сұрауы болады
      if (credentials.email === 'test@test.com' && credentials.password === 'password') {
        // Сәтті кіру жағдайында пайдаланушы деректерін орнату
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
        setIsAuthenticated(true); // Аутентификация күйін жаңарту
        setError(null); // Қателерді тазалау
        return user;
      } else {
        // Қате кіру деректемелері жағдайында қате шығару
        throw new Error('Неверный email или пароль');
      }
    } catch (err) {
      // Қате болған жағдайда қате күйін жаңарту
      setError(err.message || 'Ошибка входа');
      throw err; // Қатені жоғары деңгейге жіберу
    } finally {
      // Әрқашан орындалатын код
      setLoading(false); // Жүктелу күйін өшіру
    }
  };

  /**
   * Тіркелу функциясы
   * 
   * @param {Object} userData - Пайдаланушы деректері
   * @returns {Promise<Object>} - Пайдаланушы объектісі (жетістік жағдайында)
   * @throws {Error} - Тіркелу қатесі
   */
  const register = async (userData) => {
    try {
      setLoading(true); // Жүктелу күйін қосу
      
      // Желі кідірісін имитациялау (шынайы қосымшада API сұрауы болады)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Пайдаланушы деректерін орнату (шынайы қосымшада API жауабы болады)
      setUser({
        ...userData,
        avatar: null
      });
      setIsAuthenticated(true); // Аутентификация күйін жаңарту
      setError(null); // Қателерді тазалау
      return userData;
    } catch (err) {
      // Қате болған жағдайда қате күйін жаңарту
      setError(err.message || 'Ошибка регистрации');
      throw err; // Қатені жоғары деңгейге жіберу
    } finally {
      // Әрқашан орындалатын код
      setLoading(false); // Жүктелу күйін өшіру
    }
  };

  /**
   * Жүйеден шығу функциясы
   */
  const logout = () => {
    setIsAuthenticated(false); // Аутентификация күйін өшіру
    setUser(null); // Пайдаланушы деректерін тазалау
  };

  /**
   * Контекст мәні - барлық компоненттерге ұсынылатын мәліметтер
   */
  const value = {
    user,             // Пайдаланушы туралы ақпарат
    loading,          // Жүктелу күйі
    error,            // Қате туралы ақпарат
    login,            // Жүйеге кіру функциясы
    register,         // Тіркелу функциясы
    logout,           // Жүйеден шығу функциясы
    isAuthenticated,  // Аутентификация күйі
  };

  // Контекст провайдерін қайтару - бала компоненттерді value мәліметтерімен қамтамасыз етеді
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

