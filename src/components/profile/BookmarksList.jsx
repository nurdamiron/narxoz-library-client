import React from 'react';
import {
  Box,
  Typography,
  List,
  useTheme,
} from '@mui/material';
import { Bookmark as BookmarkIcon } from '@mui/icons-material';

// Импорт подкомпонентов
import BookmarkListItem from './BookmarkListItem';
import EmptyState from '../common/EmptyState';

/**
 * BookmarksList компоненті пайдаланушының бетбелгідегі кітаптарын көрсетеді
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Array} props.bookmarks - Бетбелгідегі кітаптар тізімі
 * @param {Function} props.onRemoveBookmark - Бетбелгіден алып тастау функциясы
 */
const BookmarksList = ({ bookmarks, onRemoveBookmark }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Бетбелгідегі кітаптар
      </Typography>
      
      {bookmarks.length > 0 ? (
        <List>
          {bookmarks.map((bookmark) => (
            <BookmarkListItem 
              key={bookmark.id} 
              bookmark={bookmark} 
              onRemoveBookmark={onRemoveBookmark} 
            />
          ))}
        </List>
      ) : (
        <EmptyBookmarksState />
      )}
    </Box>
  );
};

/**
 * Бетбелгілер жоқ күйі компоненті
 */
const EmptyBookmarksState = () => {
  return (
    <EmptyState
      icon={<BookmarkIcon />}
      title="Сізде бетбелгідегі кітаптар жоқ"
      description="Қызықты кітаптарды бетбелгіге қосыңыз, кейін оларды тез табу үшін"
      buttonText="Каталогқа өту"
      buttonLink="/books"
    />
  );
};

export default BookmarksList;