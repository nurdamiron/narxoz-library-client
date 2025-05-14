/**
 * src/components/books/BookGrid.jsx
 * 
 * Кітаптар торы компоненті
 * 
 * Бұл компонент кітаптар тізімін тор түрінде көрсетеді.
 * Әртүрлі экран өлшемдеріне бейімделеді және анимациялар қосады.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalLibrary as LocalLibraryIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Локальные компоненты
import BookCard from './BookCard';
import EmptyState from '../common/EmptyState';
import LoadingSkeleton from '../common/LoadingSkeleton';
import AlertDialog from '../common/AlertDialog';
import PaginationControl from '../common/PaginationControl';

/**
 * BookGrid компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Array} props.books - Кітаптар тізімі
 * @param {Function} props.onToggleBookmark - Бетбелгі ауысқанда шақырылатын функция
 * @param {Function} props.onBorrow - Кітапты алу түймесі басылғанда шақырылатын функция
 * @param {boolean} props.loading - Жүктелу күйі
 * @param {string} props.error - Қате хабарламасы
 * @param {number} props.currentPage - Ағымдағы бет нөмірі
 * @param {number} props.totalPages - Беттер саны
 * @param {number} props.totalItems - Барлық элементтер саны
 * @param {Function} props.onPageChange - Бет өзгергенде шақырылатын функция
 * @param {boolean} props.isAuthenticated - Пайдаланушы авторизациядан өтті ме?
 * @param {Function} props.onLoginClick - Кіру түймесін басқанда шақырылатын функция
 * @param {Object} props.sx - Қосымша Material UI стильдері
 * @returns {JSX.Element} - Кітаптар торы
 */
const BookGrid = ({
  books = [],
  onToggleBookmark,
  onBorrow,
  loading = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  isAuthenticated = false,
  onLoginClick,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  // Кіру диалогының күйі
  const [loginDialog, setLoginDialog] = useState({
    open: false,
    bookId: null
  });
  
  /**
   * Кітапты бетбелгіге қосу/алып тастау
   * 
   * @param {Object} book - Кітап объектісі
   */
  const handleToggleBookmark = (book) => {
    // Авторизациядан өтпеген болса, кіру диалогын көрсету
    if (!isAuthenticated) {
      setLoginDialog({
        open: true,
        bookId: book.id,
        action: 'bookmark'
      });
      return;
    }
    
    // Авторизациядан өткен болса, бетбелгіні ауыстыру
    if (onToggleBookmark) {
      onToggleBookmark(book);
    }
  };
  
  /**
   * Кітапты алу түймесін басу
   * 
   * @param {Object} book - Кітап объектісі
   */
  const handleBorrow = (book) => {
    // Авторизациядан өтпеген болса, кіру диалогын көрсету
    if (!isAuthenticated) {
      setLoginDialog({
        open: true,
        bookId: book.id,
        action: 'borrow'
      });
      return;
    }
    
    // Авторизациядан өткен болса, кітапты алу
    if (onBorrow) {
      onBorrow(book);
    }
  };
  
  /**
   * Кіру диалогын жабу
   */
  const handleCloseLoginDialog = () => {
    setLoginDialog({
      open: false,
      bookId: null,
      action: null
    });
  };
  
  /**
   * Кіру түймесін басу
   */
  const handleLogin = () => {
    handleCloseLoginDialog();
    if (onLoginClick) {
      onLoginClick();
    }
  };
  
  // Анимация конфигурациясы
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };
  
  // Жүктелу күйі
  if (loading) {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <LoadingSkeleton type="book" count={isMobile ? 2 : (isTablet ? 6 : 12)} />
      </Box>
    );
  }
  
  // Қате күйі
  if (error) {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
        <LoadingSkeleton type="book" count={isMobile ? 1 : (isTablet ? 3 : 6)} />
      </Box>
    );
  }
  
  // Кітаптар болмаған жағдайда
  if (books.length === 0) {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <EmptyState
          icon={<LocalLibraryIcon />}
          title={t('books.noBooks', 'Кітаптар табылмады')}
          description={t('books.tryDifferentSearch', 'Іздеу параметрлерін өзгертіп көріңіз немесе басқа категория таңдаңыз')}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={isMobile ? 2 : 3}>
          <AnimatePresence>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={isTablet ? 6 : 4} lg={3} key={book.id}>
                <motion.div 
                  variants={itemVariants} 
                  layout
                  exit="exit"
                >
                  <BookCard
                    book={book}
                    onToggleBookmark={handleToggleBookmark}
                    onBorrow={handleBorrow}
                  />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </motion.div>
      
      {/* Пагинация */}
      {books.length > 0 && totalPages > 1 && (
        <PaginationControl
          page={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={onPageChange}
          itemName={t('books.book', 'кітап')}
          currentItemCount={books.length}
          sx={{ mt: 4 }}
        />
      )}
      
      {/* Авторизация диалогы */}
      <AlertDialog
        open={loginDialog.open}
        onClose={handleCloseLoginDialog}
        title={t('books.loginRequired', 'Жүйеге кіру қажет')}
        content={
          <Typography variant="body1">
            {loginDialog.action === 'bookmark'
              ? t('auth.loginToBookmark', 'Кітапты бетбелгіге қосу үшін жүйеге кіру қажет')
              : t('auth.loginToBorrow', 'Кітапты алу үшін жүйеге кіру қажет')}
          </Typography>
        }
        type="info"
        confirmText={t('auth.loginButton', 'Кіру')}
        cancelText={t('common.cancel', 'Болдырмау')}
        onConfirm={handleLogin}
      />
    </Box>
  );
};

BookGrid.propTypes = {
  books: PropTypes.array,
  onToggleBookmark: PropTypes.func,
  onBorrow: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  totalItems: PropTypes.number,
  onPageChange: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  onLoginClick: PropTypes.func,
  sx: PropTypes.object
};

export default BookGrid;