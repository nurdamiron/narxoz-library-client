/**
 * Файл содержит все мок данные для приложения
 * Это позволяет централизованно управлять тестовыми данными
 * и использовать их в разных компонентах
 */

/**
 * Танымал кітаптардың тестілік деректері
 * 
 * Бұл массив танымал кітаптар туралы ақпаратты сақтайды
 */
export const mockPopularBooks = [
    {
      id: 1,
      title: 'Python для анализа данных',
      author: 'Уэс Маккинни',
      category: 'IT и программирование',
      cover: 'https://via.placeholder.com/150x220?text=Python',
      rating: 4.8,
      reviewCount: 203,
      available: true,
      isBookmarked: false,
      publicationYear: 2020,
    },
    {
      id: 2,
      title: 'Искусство стратегии: Теория игр для бизнеса и жизни',
      author: 'Авинаш К. Диксит, Барри Дж. Нейлбафф',
      category: 'Бизнес',
      cover: 'https://via.placeholder.com/150x220?text=Strategy',
      rating: 4.7,
      reviewCount: 156,
      available: false,
      isBookmarked: false,
      publicationYear: 2019,
    },
    {
      id: 3,
      title: 'Введение в экономическую теорию',
      author: 'Пол Самуэльсон, Уильям Нордхаус',
      category: 'Экономика',
      cover: 'https://via.placeholder.com/150x220?text=Economics',
      rating: 4.6,
      reviewCount: 178,
      available: true,
      isBookmarked: true,
      publicationYear: 2018,
    },
    {
      id: 4,
      title: 'Основы финансового менеджмента',
      author: 'Джеймс С. Ван Хорн, Джон М. Вахович',
      category: 'Финансы',
      cover: 'https://via.placeholder.com/150x220?text=Finance+Management',
      rating: 4.5,
      reviewCount: 123,
      available: true,
      isBookmarked: false,
      publicationYear: 2021,
    },
  ];
  
  /**
   * Жаңа түскен кітаптардың тестілік деректері
   * 
   * Бұл массив кітапханаға жаңадан түскен кітаптар туралы ақпаратты сақтайды
   */
  export const mockNewBooks = [
    {
      id: 5,
      title: 'Маркетинг 5.0: Технологии следующего поколения',
      author: 'Филип Котлер, Хермаван Картаджайя',
      category: 'Маркетинг',
      cover: 'https://via.placeholder.com/150x220?text=Marketing+5.0',
      rating: 4.2,
      reviewCount: 87,
      available: true,
      isBookmarked: true,
      publicationYear: 2022,
    },
    {
      id: 6,
      title: 'Корпоративное право: Учебник',
      author: 'Ивана Сергеева',
      category: 'Право',
      cover: 'https://via.placeholder.com/150x220?text=Law',
      rating: 4.0,
      reviewCount: 65,
      available: true,
      isBookmarked: false,
      publicationYear: 2021,
    },
    {
      id: 7,
      title: 'Большие данные: революция, которая изменит то, как мы живем',
      author: 'Виктор Майер-Шенбергер, Кеннет Кукьер',
      category: 'IT и программирование',
      cover: 'https://via.placeholder.com/150x220?text=Big+Data',
      rating: 4.4,
      reviewCount: 95,
      available: true,
      isBookmarked: false,
      publicationYear: 2020,
    },
    {
      id: 8,
      title: 'Управление проектами: от начала до конца',
      author: 'Лоуренс Лич',
      category: 'Менеджмент',
      cover: 'https://via.placeholder.com/150x220?text=Project+Management',
      rating: 4.3,
      reviewCount: 112,
      available: false,
      isBookmarked: false,
      publicationYear: 2019,
    },
  ];
  
  /**
   * Болатын іс-шаралардың тестілік деректері
   * 
   * Бұл массив университет кітапханасындағы болатын іс-шаралар туралы ақпаратты сақтайды
   */
  export const mockEvents = [
    {
      id: 1,
      title: 'Презентация новых поступлений',
      date: '25 марта 2025',
      time: '14:00',
      location: 'Зал библиотеки, 2 этаж',
    },
    {
      id: 2,
      title: 'Встреча с автором: Мария Иванова',
      date: '30 марта 2025',
      time: '16:30',
      location: 'Конференц-зал, 3 этаж',
    },
    {
      id: 3,
      title: 'Мастер-класс по академическому письму',
      date: '5 апреля 2025',
      time: '11:00',
      location: 'Аудитория 305',
    },
  ];
  
  /**
   * Категориялар тізімінің тестілік деректері
   * 
   * Бұл массив кітаптардың категориялары туралы ақпаратты сақтайды
   */
  export const categories = [
    { id: 1, name: 'Бизнес' },
    { id: 2, name: 'Экономика' },
    { id: 3, name: 'Финансы' },
    { id: 4, name: 'Маркетинг' },
    { id: 5, name: 'Менеджмент' },
    { id: 6, name: 'IT и программирование' },
    { id: 7, name: 'Право' },
    { id: 8, name: 'Психология' },
  ];
  
  /**
   * Жылдар тізімінің тестілік деректері
   * 
   * Бұл массив кітаптарды жылдары бойынша топтау үшін қолданылады
   */
  export const years = [
    { id: 1, name: '2022-2023' },
    { id: 2, name: '2020-2021' },
    { id: 3, name: '2018-2019' },
    { id: 4, name: 'До 2018' },
  ];
  
  /**
   * Тілдер тізімінің тестілік деректері
   * 
   * Бұл массив кітаптар тілдері туралы ақпаратты сақтайды
   */
  export const languages = [
    { id: 1, name: 'Русский' },
    { id: 2, name: 'Английский' },
    { id: 3, name: 'Казахский' },
  ];
  
  /**
   * Сұрыптау нұсқалары
   * 
   * Бұл массив кітаптарды сұрыптау нұсқаларын сақтайды
   */
  export const sortOptions = [
    { id: 'newest', name: 'Сначала новые' },
    { id: 'title', name: 'По названию' },
    { id: 'author', name: 'По автору' },
    { id: 'rating', name: 'По рейтингу' },
  ];
  
  /**
   * Пайдаланушының тестілік деректері
   * 
   * Бұл объект пайдаланушы профилінің деректерін сақтайды
   */
  export const mockUser = {
    id: 1,
    name: 'Айдар Тестов',
    email: 'aidar@test.com',
    phone: '+7 (777) 123-45-67',
    faculty: 'Экономический факультет',
    specialization: 'Финансы и кредит',
    studentId: '2023-1234',
    year: '3 курс',
    avatar: null,
  };
  
  /**
   * Таңдаулылар (закладки) үшін тестілік деректер
   * 
   * Бұл массив пайдаланушының таңдаулыларға қосқан кітаптары туралы ақпаратты сақтайды
   */
  export const mockBookmarks = [
    {
      id: 1,
      title: 'Маркетинг 5.0: Технологии следующего поколения',
      author: 'Филип Котлер, Хермаван Картаджайя',
      addedAt: '15.02.2025',
    },
    {
      id: 2,
      title: 'Введение в экономическую теорию',
      author: 'Пол Самуэльсон, Уильям Нордхаус',
      addedAt: '10.02.2025',
    },
  ];
  
  /**
   * Ағымдағы кітаптар үшін тестілік деректер
   * 
   * Бұл массив пайдаланушы қазіргі уақытта алған кітаптары туралы ақпаратты сақтайды
   */
  export const mockCurrentBooks = [
    {
      id: 1,
      title: 'Основы финансового менеджмента',
      author: 'Джеймс С. Ван Хорн, Джон М. Вахович',
      borrowedAt: '01.03.2025',
      dueAt: '15.03.2025',
      isOverdue: false,
    },
  ];
  
  /**
   * Хабарландырулар үшін тестілік деректер
   * 
   * Бұл массив пайдаланушыға келген хабарландырулар туралы ақпаратты сақтайды
   */
  export const mockNotifications = [
    {
      id: 1,
      title: 'Срок возврата книги приближается',
      message: 'Книгу "Основы финансового менеджмента" необходимо вернуть в течение 3 дней',
      date: '12.03.2025',
      read: false,
    },
    {
      id: 2,
      title: 'Новые поступления',
      message: 'В библиотеку поступили новые книги по вашей специальности',
      date: '10.03.2025',
      read: true,
    },
  ];
  
  /**
   * Кітап беру тарихының тестілік деректері
   * 
   * Бұл массив пайдаланушының кітап беру тарихын сақтайды
   */
  export const mockBorrows = [
    {
      id: 1,
      bookTitle: 'Основы финансового менеджмента',
      author: 'Джеймс С. Ван Хорн, Джон М. Вахович',
      borrowDate: '01.03.2025',
      dueDate: '15.03.2025',
      returnDate: null,
      status: 'active',
    },
    {
      id: 2,
      bookTitle: 'Маркетинг 5.0: Технологии следующего поколения',
      author: 'Филип Котлер, Хермаван Картаджайя',
      borrowDate: '15.02.2025',
      dueDate: '01.03.2025',
      returnDate: '28.02.2025',
      status: 'returned',
    },
    {
      id: 3,
      bookTitle: 'Python для анализа данных',
      author: 'Уэс Маккинни',
      borrowDate: '10.01.2025',
      dueDate: '24.01.2025',
      returnDate: '22.01.2025',
      status: 'returned',
    },
  ];
  
  /**
   * Kітаптар тізімінің толық деректері
   * 
   * Бұл массив барлық кітаптар туралы толық ақпаратты сақтайды
   */
  export const mockBooks = [
    ...mockPopularBooks,
    ...mockNewBooks,
    {
      id: 9,
      title: 'JavaScript: Подробное руководство',
      author: 'Дэвид Флэнаган',
      category: 'IT и программирование',
      cover: 'https://via.placeholder.com/150x220?text=JavaScript',
      rating: 4.9,
      reviewCount: 215,
      available: true,
      isBookmarked: false,
      publicationYear: 2020,
      description: 'Полное руководство по JavaScript, охватывающее ECMAScript 2020.',
    },
    {
      id: 10,
      title: 'Чистая архитектура',
      author: 'Роберт Мартин',
      category: 'IT и программирование',
      cover: 'https://via.placeholder.com/150x220?text=Clean+Architecture',
      rating: 4.7,
      reviewCount: 187,
      available: true,
      isBookmarked: false,
      publicationYear: 2018,
      description: 'Книга о принципах создания устойчивой архитектуры программного обеспечения.',
    },
  ];
  
  // Вспомогательная функция для имитации задержки загрузки данных
  export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));