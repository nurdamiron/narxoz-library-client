/**
 * Файл для прямого исправления проблем с ролью модератора
 * 
 * Как использовать:
 * 1. Авторизуйтесь как модератор
 * 2. Откройте консоль браузера (F12)
 * 3. Введите: fetch('/moderator-fix.js').then(r => r.text()).then(text => eval(text))
 */

(function() {
  console.log('%c🔧 Запуск инструмента исправления роли модератора', 'background: #2196f3; color: white; padding: 4px 8px; border-radius: 4px; font-size: 14px;');

  // Проверка наличия данных о пользователе
  const userDataString = localStorage.getItem('userData');
  if (!userDataString) {
    console.error('❌ Ошибка: данные пользователя не найдены в localStorage');
    console.log('Возможно, вы не авторизованы. Пожалуйста, войдите в систему как модератор.');
    return;
  }

  try {
    // Загрузка и анализ данных пользователя
    const userData = JSON.parse(userDataString);
    console.log('Текущие данные пользователя:', userData);

    if (!userData.role) {
      console.error('❌ Ошибка: у пользователя отсутствует роль');
      return;
    }

    // Проверка роли пользователя
    const originalRole = userData.role;
    const normalizedRole = originalRole.toLowerCase();

    console.log(`Текущая роль: "${originalRole}"`);
    console.log(`Нормализованная роль: "${normalizedRole}"`);

    // Проверка, является ли пользователь модератором
    if (normalizedRole !== 'moderator') {
      console.log('⚠️ Текущий пользователь не является модератором. Исправление не требуется.');
      return;
    }

    // Проверка, нужно ли исправлять регистр роли
    if (originalRole === 'moderator') {
      console.log('%c✅ Роль модератора уже в правильном регистре. Исправление не требуется.', 'color: #4caf50; font-weight: bold;');
      return;
    }

    // Исправление роли
    console.log('%c🛠️ Исправление роли модератора...', 'background: #ff9800; color: white; padding: 2px 6px; border-radius: 4px;');
    userData.role = 'moderator';
    localStorage.setItem('userData', JSON.stringify(userData));

    console.log('%c✅ Роль успешно исправлена!', 'background: #4caf50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 14px;');
    console.log('Исправлено:', {
      было: originalRole,
      стало: 'moderator'
    });

    // Добавление кнопки для перезагрузки страницы
    const button = document.createElement('button');
    button.id = 'reload-button';
    button.innerHTML = '🔄 Перезагрузить страницу для применения изменений';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#4caf50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    button.style.cursor = 'pointer';

    button.addEventListener('click', () => {
      window.location.reload();
    });

    document.body.appendChild(button);

    console.log('Нажмите кнопку в правом верхнем углу для перезагрузки страницы и применения изменений.');

  } catch (error) {
    console.error('❌ Ошибка при исправлении роли модератора:', error);
  }
})();