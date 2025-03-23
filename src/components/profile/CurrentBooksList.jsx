import React from 'react';
import {
  Box,
  Typography,
  List,
  useTheme,
} from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';

// Импорт подкомпонентов
import BookListItem from '../books/BookListItem';
import EmptyState from '../common/EmptyState';

/**
 * CurrentBooksList компоненті пайдаланушының ағымдағы қарызға алынған кітаптарын көрсетеді
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Array} props.books - Ағымдағы кітаптар тізімі
 * @param {Function} props.onReturnBook - Кітапты қайтару функциясы
 */
const CurrentBooksList = ({ books, onReturnBook }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Ағымдағы кітаптар
      </Typography>
      
      {books.length > 0 ? (
        <BookList books={books} onReturnBook={onReturnBook} />
      ) : (
        <EmptyBooksState />
      )}
    </Box>
  );
};

/**
 * Кітаптар тізімі компоненті
 */
const BookList = ({ books, onReturnBook }) => {
  return (
    <List>
      {books.map((book) => (
        <BookListItem key={book.id} book={book} onReturnBook={onReturnBook} />
      ))}
    </List>
  );
};

/**
 * Кітаптар жоқ күйі компоненті
 */
const EmptyBooksState = () => {
  return (
    <EmptyState
      icon={<HistoryIcon />}
      title="Сізде алынған кітаптар жоқ"
      description="Сіз университет кітапханасынан кітаптар ала аласыз"
      buttonText="Каталогқа өту"
      buttonLink="/books"
    />
  );
};

export default CurrentBooksList;