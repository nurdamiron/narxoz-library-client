/**
 * src/utils/errorMessages.js
 * 
 * Қате хабарламаларының аудармалары
 * 
 * Бұл файл сервердегі қателер мен олардың казақ тіліндегі 
 * аудармаларын сәйкестендіреді.
 */

// Бэкендтен келген ағылшын тіліндегі қателер және қазақша аудармалары
const errorTranslations = {
  // Аутентификация қателері
  'Email address already in use': 'Бұл электрондық пошта тіркелгісі жүйеде бар. Басқа пошта мекенжайын пайдаланыңыз немесе кіру бетіне өтіңіз.',
  'Invalid credentials': 'Жарамсыз тіркелгі деректері. Логин немесе құпия сөз дұрыс емес.',
  'User account is blocked': 'Тіркелгіңіз бұғатталған. Әкімшіге хабарласыңыз.',
  'Password must be at least 6 characters': 'Құпия сөз кем дегенде 6 таңбадан тұруы керек.',
  'Email format is invalid': 'Жарамды электрондық пошта мекенжайын енгізіңіз.',
  'This username is already taken': 'Бұл логин бұрыннан бар, басқа логин таңдаңыз.',
  'This email is already registered': 'Бұл email бұрыннан тіркелген.',
  'emailExists': 'Бұл электрондық пошта тіркелгісі жүйеде бар. Басқа пошта мекенжайын пайдаланыңыз.',
  'This student ID is already registered': 'Бұл студенттік билет нөірі бұрыннан тіркелген.',

  // Рұқсат қателері
  'Not authorized to access this resource': 'Бұл ресурсқа қол жеткізуге рұқсатыңыз жоқ.',
  'Access forbidden': 'Қол жеткізу тыйым салынған.',
  'Not authorized to register users': 'Пайдаланушыларды тіркеуге рұқсатыңыз жоқ.',

  // Валидация қателері
  'All required fields must be filled': 'Барлық міндетті өрістерді толтырыңыз.',
  'Invalid role. Only "admin" or "student" roles are allowed': 'Жарамсыз рөл. Тек "admin" немесе "student" рөлі болуы керек.',
  'Please enter a valid email': 'Жарамды email енгізіңіз.',

  // Жалпы қате хабарламасы
  'An error occurred. Please try again': 'Қате орын алды. Әрекетті қайталап көріңіз.',
  'Server error': 'Сервер қатесі. Әрекетті кейінірек қайталап көріңіз.'
};

/**
 * Қате хабарламасын аудару
 * 
 * @param {string|Error|Object} error - Аударылатын қате объектісі немесе хабарламасы
 * @returns {string} - Аударылған қате хабарламасы
 */
export const translateError = (error) => {
  if (!error) return '';
  
  console.log('Translating error:', error);
  
  // Проверка на случай, если передан строковый "[object Object]"
  if (error === '[object Object]') {
    console.warn('Received "[object Object]" string instead of actual error object');
    return 'Белгісіз қате орын алды. Әрекетті қайталап көріңіз.';
  }
  
  // Если error - строка, просто используем её
  if (typeof error === 'string') {
    return errorTranslations[error] || error;
  }
  
  // Проверка HTTP статус кодов для более точных сообщений
  if (error.response && error.response.status) {
    const { status, data } = error.response;
    console.log(`HTTP Error ${status}:`, data);
    
    switch (status) {
      case 400:
        // Проверка на распространенные ошибки валидации
        if (data) {
          // Проверка если data представляет собой строку
          if (typeof data === 'string') {
            return errorTranslations[data] || data;
          }
          
          // Проверка на ошибку с email
          if (data.error && (
              data.error.includes('email') || 
              data.error.includes('Email') ||
              data.message && data.message.includes('email')
          )) {
            return 'Бұл email бұрыннан тіркелген. Басқа email пайдаланыңыз.';
          }
          
          // Проверка на ошибку существующего логина
          if (data.error && (
              data.error.includes('логин') || 
              data.error.includes('username') ||
              data.message && data.message.includes('username')
          )) {
            return 'Бұл логин бұрыннан тіркелген. Басқа логин таңдаңыз.';
          }
          
          // Проверяем все возможные поля с ошибками
          const errorFields = ['error', 'message', 'errorMessage'];
          for (const field of errorFields) {
            if (data[field] && typeof data[field] === 'string') {
              return errorTranslations[data[field]] || data[field];
            }
          }
          
          // Если в данных есть конкретные ошибки валидации для полей
          if (data.errors && Array.isArray(data.errors)) {
            return data.errors.map(err => 
              errorTranslations[err.msg || err.message] || err.msg || err.message
            ).join('. ');
          }
          
          // Если в данных есть объект ошибок с полями (например, { username: 'Логин занят' })
          if (data.errors && typeof data.errors === 'object') {
            const errorMessages = [];
            for (const field in data.errors) {
              const fieldError = data.errors[field];
              const translatedError = errorTranslations[fieldError] || fieldError;
              errorMessages.push(`${field}: ${translatedError}`);
            }
            return errorMessages.join('. ');
          }
        }
        return 'Қате деректер. Өрістерді тексеріп, қайталап көріңіз.';
        
      case 401:
        return 'Рұқсат жоқ. Қайта кіру қажет.';
        
      case 403:
        return 'Бұл әрекетті орындауға рұқсатыңыз жоқ.';
        
      case 404:
        return 'Сұралған ресурс табылмады.';
        
      case 409:
        // Детальная обработка ошибок конфликта данных
        if (data) {
          if (data.error && data.error.includes('email')) {
            return 'Бұл email бұрыннан тіркелген. Басқа email пайдаланыңыз.';
          }
          if (data.error && data.error.includes('username')) {
            return 'Бұл логин бұрыннан тіркелген. Басқа логин таңдаңыз.';
          }
          if (data.error) {
            return errorTranslations[data.error] || data.error;
          }
        }
        return 'Бұл деректер бұрыннан тіркелген (email немесе логин).';
        
      case 500:
        return 'Сервер қатесі. Кейінірек қайталап көріңіз.';
    }
  }
  
  // Если error - объект ошибки (Error)
  if (error instanceof Error) {
    return errorTranslations[error.message] || error.message;
  }
  
  // Если error - объект с response от API
  if (error.response?.data) {
    const { data } = error.response;
    console.log('Error response data:', data);
    
    // Проверка на строку
    if (typeof data === 'string') {
      return errorTranslations[data] || data;
    }
    
    // Проверка на поле error или message
    if (typeof data.error === 'string') {
      return errorTranslations[data.error] || data.error;
    } else if (data.message) {
      return errorTranslations[data.message] || data.message;
    } else if (Array.isArray(data.errors) && data.errors.length > 0) {
      // Если ошибки представлены в виде массива
      return data.errors.map(err => 
        errorTranslations[err.message || err.msg] || err.message || err.msg
      ).join('. ');
    }
  }
  
  // Если есть свойство message в объекте ошибки
  if (error.message) {
    return errorTranslations[error.message] || error.message;
  }
  
  // Попытка преобразовать объект в строку для отладки
  try {
    console.log('Converting error object to string:', error);
    const errorString = JSON.stringify(error);
    
    // Если результат преобразования пустой объект, возвращаем общее сообщение
    if (errorString === '{}' || errorString === '[]') {
      return 'Белгісіз қате орын алды. Әрекетті қайталап көріңіз.';
    }
    
    return `Қате деректері: ${errorString}`;
  } catch (e) {
    console.error('Error stringifying error object:', e);
    // Как крайний вариант
    return 'Белгісіз қате орын алды. Әрекетті қайталап көріңіз.';
  }
};

export default errorTranslations; 