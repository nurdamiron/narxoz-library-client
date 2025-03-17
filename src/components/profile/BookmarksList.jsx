import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  List,
  useTheme,
  alpha,
} from '@mui/material';
import { Bookmark as BookmarkIcon } from '@mui/icons-material';
import EmptyState from '../common/EmptyState';

/**
 * BookmarksList component displays the user's bookmarked books
 * 
 * @param {Object} props - Component props
 * @param {Array} props.bookmarks - List of bookmarked books
 * @param {Function} props.onRemoveBookmark - Function to handle removing a bookmark
 */
const BookmarksList = ({ bookmarks, onRemoveBookmark }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Книги в закладках
      </Typography>
      
      {bookmarks.length > 0 ? (
        <List>
          {/* Таңдаулылар тізімі */}
          {bookmarks.map((bookmark) => (
            <Paper
              key={bookmark.id}
              sx={{
                mb: 2,
                p: 3,
                borderRadius: 2,
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
                    {bookmark.title}
                  </Typography>
                  {/* Кітап авторы */}
                  <Typography variant="body2" color="text.secondary">
                    {bookmark.author}
                  </Typography>
                  {/* Қосылған күні */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      mt: 1,
                    }}
                  >
                    Добавлено: {bookmark.addedAt}
                  </Typography>
                </Grid>
                <Grid item>
                  {/* Таңдаулыдан алып тастау түймесі */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onRemoveBookmark(bookmark.id)}
                    sx={{ 
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.main,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.05),
                        borderColor: theme.palette.error.main,
                      }
                    }}
                  >
                    Удалить
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </List>
      ) : (
        <EmptyState
          icon={<BookmarkIcon />}
          title="У вас нет книг в закладках"
          description="Добавляйте интересующие вас книги в закладки, чтобы быстро находить их позже"
          buttonText="Перейти в каталог"
          buttonLink="/books"
        />
      )}
    </Box>
  );
};

export default BookmarksList;