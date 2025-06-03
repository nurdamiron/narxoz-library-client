/**
 * src/components/books/TopBooksByCategory.jsx
 * 
 * Компонент для отображения ТОП книг по категориям
 * 
 * Этот компонент отображает самые популярные книги, сгруппированные по категориям.
 * Популярность определяется на основе рейтинга, количества закладок и заимствований.
 */
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Skeleton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Book as BookIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

// Импорт компонентов
import BookCard from './BookCard';
import EmptyState from '../common/EmptyState';

// Импорт сервисов
import bookService from '../../services/bookService';

/**
 * TopBooksByCategory компонент
 * 
 * @param {Object} props - Параметры компонента
 * @param {Function} props.onToggleBookmark - Функция для переключения закладки
 * @param {Function} props.onBorrow - Функция для заимствования книги
 * @param {number} props.booksPerCategory - Количество книг на категорию (по умолчанию 3)
 * @param {number} props.minRating - Минимальный рейтинг (по умолчанию 0)
 * @param {boolean} props.showViewAll - Показывать ли кнопку "Посмотреть все" (по умолчанию true)
 * @returns {JSX.Element} - Компонент ТОП книг по категориям
 */
const TopBooksByCategory = ({
  onToggleBookmark,
  onBorrow,
  booksPerCategory = 3,
  minRating = 0,
  showViewAll = true
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  // Состояния
  const [categoriesWithBooks, setCategoriesWithBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /**
   * Загрузка данных ТОП книг по категориям
   */
  useEffect(() => {
    const fetchTopBooksByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await bookService.getTopBooksByCategory(booksPerCategory, minRating);
        
        if (response.success) {
          setCategoriesWithBooks(response.data);
        } else {
          setError(t('books.loadingError', 'Ошибка при загрузке книг'));
        }
      } catch (err) {
        console.error('Ошибка при загрузке ТОП книг по категориям:', err);
        setError(t('books.loadingError', 'Ошибка при загрузке книг'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopBooksByCategory();
  }, [booksPerCategory, minRating, t]);
  
  // Анимационные варианты
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const categoryVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Рендер скелетона загрузки
  const renderSkeleton = () => (
    <Box>
      {[...Array(3)].map((_, categoryIndex) => (
        <Box key={categoryIndex} sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="rectangular" width={40} height={40} sx={{ mr: 2, borderRadius: 1 }} />
            <Skeleton variant="text" width={200} height={40} />
          </Box>
          
          <Grid container spacing={3}>
            {[...Array(booksPerCategory)].map((_, bookIndex) => (
              <Grid item key={bookIndex} xs={12} sm={6} md={4}>
                <BookCard isLoading={true} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
  
  // Если загрузка
  if (loading) {
    return renderSkeleton();
  }
  
  // Если ошибка
  if (error) {
    return (
      <EmptyState
        icon={<BookIcon sx={{ fontSize: 40 }} />}
        title={t('books.errorTitle', 'Ошибка загрузки')}
        description={error}
      />
    );
  }
  
  // Если нет данных
  if (categoriesWithBooks.length === 0) {
    return (
      <EmptyState
        icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
        title={t('books.noTopBooks', 'ТОП книги не найдены')}
        description={t('books.noTopBooksDesc', 'Пока нет книг с достаточным рейтингом для отображения в ТОП')}
      />
    );
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box>
        {/* Заголовок секции */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                p: 1.5,
                borderRadius: 2,
                mr: 2,
                color: theme.palette.primary.main
              }}
            >
              <TrendingUpIcon />
            </Box>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ fontWeight: 'bold' }}
            >
              {t('books.topByCategory', 'ТОП книги по категориям')}
            </Typography>
          </Box>
          
          {showViewAll && (
            <Button
              component={RouterLink}
              to="/books"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 'medium' }}
            >
              {t('common.viewAll', 'Посмотреть все')}
            </Button>
          )}
        </Box>
        
        {/* Категории с книгами */}
        {categoriesWithBooks.map((categoryData, index) => (
          <motion.div
            key={categoryData.category.id}
            variants={categoryVariants}
          >
            <Card 
              elevation={2}
              sx={{ 
                mb: 4,
                borderRadius: 3,
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Заголовок категории */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        p: 1,
                        borderRadius: 1,
                        mr: 2,
                        color: theme.palette.secondary.main
                      }}
                    >
                      <BookIcon />
                    </Box>
                    
                    <Box>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        sx={{ fontWeight: 'bold', mb: 0.5 }}
                      >
                        {categoryData.category.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          size="small"
                          icon={<StarIcon />}
                          label={t('books.topBooks', 'ТОП книги')}
                          sx={{
                            backgroundColor: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.main,
                            fontWeight: 'medium'
                          }}
                        />
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ ml: 2 }}
                        >
                          {t('books.booksCount', {
                            count: categoryData.books.length,
                            defaultValue: `${categoryData.books.length} книг`
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Button
                    component={RouterLink}
                    to={`/books?categoryId=${categoryData.category.id}&sort=-rating`}
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'medium'
                    }}
                  >
                    {t('books.viewCategory', 'Посмотреть категорию')}
                  </Button>
                </Box>
                
                {/* Книги категории */}
                <Grid container spacing={2}>
                  {categoryData.books.map((book) => (
                    <Grid 
                      item 
                      key={book.id} 
                      xs={12} 
                      sm={6} 
                      md={3}
                      lg={2.4}
                    >
                      <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <BookCard
                          book={book}
                          onToggleBookmark={onToggleBookmark}
                          onBorrow={onBorrow}
                          showRating={true}
                          showStats={true}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {/* Информационная панель */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            {t('books.topBooksInfo', 'ТОП книги определяются на основе рейтинга, количества закладок и заимствований. Показаны только книги с рейтингом выше')} {minRating}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default TopBooksByCategory;