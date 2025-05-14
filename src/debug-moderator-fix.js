/**
 * Автоматическое исправление проблем доступа модератора
 * 
 * Этот файл содержит утилиты для автоматического обнаружения и
 * исправления распространенных проблем с доступом модератора
 */

// Функция для проверки и исправления проблем с регистром роли
export function fixModeratorRoleCase() {
  console.log('🔧 Запуск исправления проблем с ролью модератора...');
  
  try {
    // 1. Проверяем данные в localStorage
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      console.log('❌ Данные пользователя не найдены в localStorage');
      return false;
    }
    
    const userData = JSON.parse(userDataString);
    if (!userData || !userData.role) {
      console.log('❌ В данных пользователя отсутствует поле role');
      return false;
    }
    
    // 2. Проверяем, нужно ли исправлять регистр роли
    const originalRole = userData.role;
    const normalizedRole = originalRole.toLowerCase();
    
    // Если роль уже в нижнем регистре и это модератор, всё в порядке
    if (originalRole === normalizedRole && normalizedRole === 'moderator') {
      console.log('✅ Роль модератора уже в нормализованном виде:', originalRole);
      return true;
    }
    
    // 3. Проверяем, является ли пользователь модератором (независимо от регистра)
    if (normalizedRole !== 'moderator') {
      console.log('❌ Текущий пользователь не является модератором:', originalRole);
      return false;
    }
    
    // 4. Исправляем регистр роли, если это необходимо
    console.log('🔄 Исправление регистра роли:', {
      было: originalRole,
      стало: 'moderator'
    });
    
    userData.role = 'moderator';
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log('✅ Роль модератора успешно исправлена. Перезагрузка страницы для применения изменений...');
    
    // 5. Обновляем страницу для применения изменений
    setTimeout(() => {
      window.location.reload();
    }, 1500);
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка при исправлении роли модератора:', error);
    return false;
  }
}

// Функция для внедрения кнопки исправления на страницу
export function injectModeratorFixButton() {
  if (document.getElementById('moderator-fix-button')) {
    return;
  }
  
  const button = document.createElement('button');
  button.id = 'moderator-fix-button';
  button.innerHTML = '🔧 Исправить роль модератора';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  button.style.padding = '10px 15px';
  button.style.backgroundColor = '#ff5722';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  button.style.cursor = 'pointer';
  
  button.addEventListener('click', () => {
    const fixed = fixModeratorRoleCase();
    if (fixed) {
      button.innerHTML = '✅ Роль исправлена, перезагрузка...';
      button.style.backgroundColor = '#4caf50';
      button.disabled = true;
    } else {
      button.innerHTML = '❌ Ошибка исправления';
      button.style.backgroundColor = '#f44336';
    }
  });
  
  document.body.appendChild(button);
  
  // Экспортируем функцию для доступа из консоли
  window.fixModeratorRoleCase = fixModeratorRoleCase;
  
  console.log('%c🔧 Кнопка исправления добавлена', 'background: #ff5722; color: white; padding: 2px 6px; border-radius: 4px;');
}

// Функция для автоматической проверки и исправления проблем при загрузке
export function autoCheckModeratorRole() {
  setTimeout(() => {
    try {
      // Проверяем, есть ли данные о пользователе
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) return;
      
      const userData = JSON.parse(userDataString);
      if (!userData || !userData.role) return;
      
      // Проверяем, является ли пользователь модератором (независимо от регистра)
      const normalizedRole = userData.role.toLowerCase();
      if (normalizedRole !== 'moderator') return;
      
      // Если роль не в нижнем регистре, предлагаем исправление
      if (userData.role !== 'moderator') {
        console.log('%c⚠️ Обнаружена проблема с регистром роли модератора!', 'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
        console.log('Текущая роль:', userData.role);
        console.log('Требуемая роль:', 'moderator');
        
        // Добавляем кнопку для исправления
        injectModeratorFixButton();
      }
    } catch (error) {
      console.error('Ошибка при автопроверке роли модератора:', error);
    }
  }, 1000);
}

// Автоматически запускаем проверку при загрузке скрипта
autoCheckModeratorRole();