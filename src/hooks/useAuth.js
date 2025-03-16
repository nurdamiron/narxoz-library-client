import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth Hook - аутентификация контекстін пайдалануды жеңілдетеді
 * 
 * Бұл hook компоненттерге AuthContext мәліметтеріне оңай қол жеткізуге мүмкіндік береді.
 * Егер компонент AuthProvider-дің сыртында болса, қате шығарады.
 * 
 * @returns {Object} - AuthContext мәні (пайдаланушы, күй, функциялар)
 * @throws {Error} - Егер контекст AuthProvider сыртында пайдаланылса
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};