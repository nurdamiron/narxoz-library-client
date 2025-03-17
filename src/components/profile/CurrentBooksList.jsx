import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  List,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import EmptyState from '../common/EmptyState';

/**
 * CurrentBooksList component displays the user's currently borrowed books
 * 
 * @param {Object} props - Component props
 * @param {Array} props.books - List of currently borrowed books
 * @param {Function} props.onReturnBook - Function to handle returning a book
 */
const CurrentBooksList = ({ books, onReturnBook }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Текущие книги
      </Typography>
      
      {books.length > 0 ? (
        <List>
          {/* Ағымдағы кітаптар тізімі */}
          {books.map((book) => (
            <Paper
              key={book.id}
              sx={{
                mb: 2,
                p: 3,
                borderRadius: 2,
                border: book.isOverdue
                  ? `1px solid ${theme.palette.error.main}` // Мерзімі өткен кітаптар үшін қызыл жиек
                  : 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  boxShadow: theme.shadows[3],
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Grid container alignItems="center">
                <Grid item xs>
                  {/* Кітап атауы */}
                  <Typography variant="h6" fontWeight="medium" color="#d50032">
                    {book.title}
                  </Typography>
                  {/* Кітап авторы */}
                  <Typography variant="body2" color="text.secondary">
                    {book.author}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {/* Алған күні */}
                    <Chip
                      label={`Взято: ${book.borrowedAt}`}
                      size="small"
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                      }}
                    />
                    {/* Қайтару мерзімі */}
                    <Chip
                      label={`Вернуть до: ${book.dueAt}`}
                      size="small"
                      sx={{ 
                        mb: 1,
                        bgcolor: book.isOverdue 
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.warning.main, 0.1),
                        color: book.isOverdue
                          ? theme.palette.error.main
                          : theme.palette.warning.main,
                      }}
                    />
                    {/* Мерзімі өткен жағдайда көрсетілетін хабарлама */}
                    {book.isOverdue && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        Просрочено! Пожалуйста, верните книгу как можно скорее.
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item>
                  {/* Кітапты қайтару түймесі */}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onReturnBook(book)}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#d50032',
                      '&:hover': {
                        bgcolor: alpha('#d50032', 0.9),
                      }
                    }}
                  >
                    Вернуть
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </List>
      ) : (
        <EmptyState
          icon={<HistoryIcon />}
          title="У вас нет взятых книг"
          description="Вы можете взять книги в библиотеке университета"
          buttonText="Перейти в каталог"
          buttonLink="/books"
        />
      )}
    </Box>
  );
};

export default CurrentBooksList;