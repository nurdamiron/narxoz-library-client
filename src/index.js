// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import App from './App';
import './index.css';

// Функция для отслеживания изменений в сессии
const setupAdminRedirect = () => {
  const userEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
  
  // Проверка на админа
  if (userEmail === 'admin@narxoz.kz') {
    console.log('Detected admin login, will redirect to admin panel');
    // Перенаправление на админ-панель при обнаружении логина админа
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/admin')) {
      setTimeout(() => {
        window.location.href = '/admin';
      }, 500);
    }
  }
}

// Вызываем функцию проверки
setupAdminRedirect();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);