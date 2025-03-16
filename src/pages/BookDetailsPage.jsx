import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Skeleton,
  Divider,
} from '@mui/material';
import BookDetails from '../components/books/BookDetails';

/**
 * Жүктеу кідірісін имитациялау функциясы
 * 
 * Бұл функция серверден мәліметтер жүктеуді имитациялау үшін қолданылады
 * 
 * @param {number} ms - Миллисекундпен көрсетілген кідіріс уақыты
 * @returns {Promise<void>} - Кідіріс аяқталғаннан кейін орындалатын Promise
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Тестілік кітаптар тізімі
 * 
 * Бұл массив кітаптардың деректерін сақтайды. Әр кітап объектісі келесі қасиеттерді қамтиды:
 * - id: Кітаптың бірегей идентификаторы
 * - title: Кітаптың атауы
 * - author: Автор аты-жөні
 * - category: Кітап категориясы
 * - cover: Кітап мұқабасының суреті (URL)
 * - rating: Рейтинг (1-ден 5-ке дейін)
 * - reviewCount: Пікірлер саны
 * - available: Қолжетімділік (true/false)
 * - isBookmarked: Таңдаулыларға қосылған-қосылмағаны (true/false)
 * - publicationYear: Жарияланған жылы
 * - description: Кітаптың сипаттамасы
 */

// Тестовые данные книг
const mockBooks = [
  {
    id: 1,
    title: 'Основы финансового менеджмента',
    author: 'Джеймс С. Ван Хорн, Джон М. Вахович',
    category: 'Финансы',
    cover: 'https://via.placeholder.com/150x220?text=Finance+Management',
    rating: 4.5,
    reviewCount: 123,
    available: true,
    isBookmarked: false,
    publicationYear: 2021,
    description: 'Учебник по финансовому менеджменту для студентов экономических специальностей. Книга содержит полный обзор современной теории и практики финансового менеджмента. В ней рассматриваются базовые концепции финансового менеджмента, управления оборотным капиталом, структурой капитала, дивидендной политикой, инвестиционная деятельность предприятия и оценка стоимости бизнеса.',
  },
  {
    id: 2,
    title: 'Маркетинг 5.0: Технологии следующего поколения',
    author: 'Филип Котлер, Хермаван Картаджайя',
    category: 'Маркетинг',
    cover: 'https://via.placeholder.com/150x220?text=Marketing+5.0',
    rating: 4.2,
    reviewCount: 87,
    available: true,
    isBookmarked: true,
    publicationYear: 2022,
    description: 'Книга о новейших технологиях в маркетинге и их применении в бизнесе. Авторы рассматривают основные тенденции развития маркетинга в эпоху цифровизации, включая использование искусственного интеллекта, больших данных, интернета вещей и других технологий. Книга содержит практические рекомендации по внедрению инновационных маркетинговых стратегий и инструментов.',
  },
  {
    id: 3,
    title: 'Искусство стратегии: Теория игр для бизнеса и жизни',
    author: 'Авинаш К. Диксит, Барри Дж. Нейлбафф',
    category: 'Бизнес',
    cover: 'https://via.placeholder.com/150x220?text=Strategy',
    rating: 4.7,
    reviewCount: 156,
    available: false,
    isBookmarked: false,
    publicationYear: 2019,
    description: 'Применение теории игр в стратегическом планировании бизнеса и принятии решений. Авторы представляют теорию игр как мощный инструмент для анализа стратегических решений в бизнесе и повседневной жизни. В книге рассматриваются такие концепции, как доминирующие стратегии, равновесие Нэша, кооперативные и некооперативные игры, а также приводятся многочисленные примеры их применения.',
  },
  {
    id: 4,
    title: 'Python для анализа данных',
    author: 'Уэс Маккинни',
    category: 'IT и программирование',
    cover: 'https://via.placeholder.com/150x220?text=Python',
    rating: 4.8,
    reviewCount: 203,
    available: true,
    isBookmarked: false,
    publicationYear: 2020,
    description: 'Практическое руководство по анализу данных с использованием языка Python. Книга представляет собой исчерпывающее руководство по использованию Python для решения задач обработки и анализа данных. Автор - создатель библиотеки pandas - подробно рассматривает инструменты экосистемы Python для анализа данных, включая NumPy, pandas, Matplotlib и Jupyter Notebook. Издание содержит множество практических примеров и решений типичных задач обработки данных.',
  },
  {
    id: 5,
    title: 'Корпоративное право: Учебник',
    author: 'Ивана Сергеева',
    category: 'Право',
    cover: 'https://via.placeholder.com/150x220?text=Law',
    rating: 4.0,
    reviewCount: 65,
    available: true,
    isBookmarked: false,
    publicationYear: 2021,
    description: 'Учебник по корпоративному праву для студентов юридических специальностей. В учебнике рассматриваются основные институты корпоративного права, включая понятие и виды корпораций, порядок их создания и ликвидации, корпоративное управление, права и обязанности участников корпораций, особенности ответственности в корпоративных правоотношениях. Особое внимание уделяется практическим аспектам применения корпоративного законодательства.',
  },
  {
    id: 6,
    title: 'Введение в экономическую теорию',
    author: 'Пол Самуэльсон, Уильям Нордхаус',
    category: 'Экономика',
    cover: 'https://via.placeholder.com/150x220?text=Economics',
    rating: 4.6,
    reviewCount: 178,
    available: true,
    isBookmarked: true,
    publicationYear: 2018,
    description: 'Классический учебник по основам экономической теории. Книга представляет собой фундаментальный учебник по экономической теории, охватывающий все ключевые концепции микро- и макроэкономики. Авторы подробно объясняют принципы функционирования рыночной экономики, теорию спроса и предложения, поведение потребителей и фирм, макроэкономические показатели, модели экономического роста, денежно-кредитную и фискальную политику и многие другие темы.',
  },
  {
    id: 7,
    title: 'Управление проектами: от начала до конца',
    author: 'Лоуренс Лич',
    category: 'Менеджмент',
    cover: 'https://via.placeholder.com/150x220?text=Project+Management',
    rating: 4.3,
    reviewCount: 112,
    available: false,
    isBookmarked: false,
    publicationYear: 2019,
    description: 'Практическое руководство по управлению проектами для менеджеров и руководителей. Книга предлагает системный подход к управлению проектами, основанный на методологии критической цепи. Автор рассматривает все этапы жизненного цикла проекта, начиная от инициации и планирования, заканчивая реализацией и завершением. Особое внимание уделяется методам управления рисками, ресурсами и сроками проекта, а также вопросам формирования и развития проектных команд.',
  },
  {
    id: 8,
    title: 'Большие данные: революция, которая изменит то, как мы живем',
    author: 'Виктор Майер-Шенбергер, Кеннет Кукьер',
    category: 'IT и программирование',
    cover: 'https://via.placeholder.com/150x220?text=Big+Data',
    rating: 4.4,
    reviewCount: 95,
    available: true,
    isBookmarked: false,
    publicationYear: 2020,
    description: 'Книга о влиянии больших данных на бизнес, науку и общество. Авторы исследуют феномен больших данных и его влияние на экономику, политику, образование, здравоохранение и другие сферы жизни. В книге объясняется, как анализ огромных массивов информации меняет наши представления о мире и открывает новые возможности для бизнеса и научных исследований. Также рассматриваются социальные, правовые и этические проблемы, связанные с использованием больших данных.',
  },
];

/**
 * BookDetailsPage компоненті - жеке кітаптың толық ақпаратын көрсететін бет
 * 
 * Бұл компонент URL параметрінен кітаптың идентификаторын алып,
 * оған сәйкес кітаптың толық ақпаратын көрсетеді.
 * 
 * Компонент келесі күйлерді қолданады:
 * - loading: Кітап деректерінің жүктелу күйі
 * - book: Кітап туралы ақпарат
 * - error: Қате туралы ақпарат (егер қате орын алса)
 */

const BookDetailsPage = () => {
  const { id } = useParams(); // URL-ден кітап идентификаторын алу
  const [book, setBook] = useState(null); // Кітап деректері күйі
  const [loading, setLoading] = useState(true); // Жүктелу күйі
  const [error, setError] = useState(null); // Қате күйі

  /**
   * Кітап деректерін жүктеу
   * 
   * useEffect қолдану арқылы компонент жүктелгенде
   * немесе кітап идентификаторы өзгергенде орындалады
   */
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true); // Жүктелу күйін қосу
      setError(null); // Қате күйін тазалау
      
      try {
        // API жауабының кідірісін имитациялау
        await delay(800);
        
        // ID бойынша кітапты іздеу
        const bookId = parseInt(id, 10);
        const foundBook = mockBooks.find(b => b.id === bookId);
        
        if (foundBook) {
          setBook(foundBook); // Кітап табылса, оны күйге сақтау
        } else {
          setError('Книга не найдена'); // Кітап табылмаса, қате күйін орнату
        }
      } catch (err) {
        setError('Ошибка при загрузке данных'); // Басқа қате болса, қате күйін орнату
        console.error(err);
      } finally {
        setLoading(false); // Жүктелу күйін өшіру
      }
    };
    
    fetchBook(); // Функцияны шақыру
  }, [id]); // Тек id өзгергенде қайта орындау

  return (
    <Box>
      {/* Breadcrumbs - навигация сілтемелері */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Главная
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/books">
          Каталог
        </Link>
        {/* Кітап атауын тек жүктелу аяқталған соң және кітап табылған жағдайда көрсету */}
        {!loading && book && (
          <Typography color="text.primary">
            {book.title}
          </Typography>
        )}
      </Breadcrumbs>
      
      {/* Жүктелу кезінде скелетон көрсету */}
      {loading ? (
        <Box>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="20%" height={30} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Skeleton variant="rectangular" width={300} height={400} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
              <Divider sx={{ my: 2 }} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
            </Box>
          </Box>
        </Box>
      ) : error ? (
        // Қате болған жағдайда қате туралы хабарлама көрсету
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body1">
            К сожалению, запрашиваемая книга не найдена или произошла ошибка при загрузке данных.
          </Typography>
          <Link
            component={RouterLink}
            to="/books"
            sx={{ display: 'block', mt: 2 }}
          >
            Вернуться в каталог
          </Link>
        </Box>
      ) : book ? (
        // Кітап туралы ақпаратты көрсету - BookDetails компонентін қолдану
        <BookDetails book={book} />
      ) : null}
    </Box>
  );
};

export default BookDetailsPage;