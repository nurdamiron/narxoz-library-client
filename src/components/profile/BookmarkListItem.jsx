import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Button,
  useTheme,
  alpha,
} from '@mui/material';

/**
 * BookmarkListItem компоненті - жеке бетбелгі элементі
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Object} props.bookmark - Бетбелгі объектісі
 * @param {Function} props.onRemoveBookmark - Бетбелгіден алып тастау функциясы
 */
const BookmarkListItem = ({ bookmark, onRemoveBookmark }) => {
  const theme = useTheme();

  return (
    <Paper
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
            Қосылған күні: {bookmark.addedAt}
          </Typography>
        </Grid>
        
        <Grid item>
          {/* Бетбелгіден алып тастау түймесі */}
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
            Жою
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookmarkListItem;