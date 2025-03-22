import { useContext } from 'react';
import  AuthContext from '../context/AuthContext';

/**
 * useAuth хук - аутентификация контекстін пайдалану
 * 
 * Бұл хук AuthContext контекстін пайдалануды жеңілдетеді.
 * Хукты пайдалану арқылы компоненттер аутентификация күйін және
 * оған қатысты функцияларды оңай ала алады.
 * 
 * @returns {Object} AuthContext мәні
 * @returns {Object} AuthContext.user - Аутентификацияланған пайдаланушы туралы ақпарат
 * @returns {boolean} AuthContext.loading - Аутентификация процесінің жүктелу күйі
 * @returns {string} AuthContext.error - Аутентификация қатесі (егер болса)
 * @returns {boolean} AuthContext.isAuthenticated - Пайдаланушының аутентификацияланған/аутентификацияланбаған күйі
 * @returns {Function} AuthContext.login - Жүйеге кіру функциясы
 * @returns {Function} AuthContext.register - Тіркелу функциясы
 * @returns {Function} AuthContext.logout - Жүйеден шығу функциясы
 */
export const useAuth = () => {
  // AuthContext контекстін пайдалану
  const context = useContext(AuthContext);
  
  // Егер контекст табылмаса, қате шығару
  if (context === undefined) {
    throw new Error('useAuth хукты AuthProvider ішінде пайдалану керек');
  }
  
  return context;
};

export default useAuth;