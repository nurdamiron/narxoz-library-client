import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import dashboardService from '../../../services/dashboardService';
import { useTranslation } from 'react-i18next';

const CategoryStats = () => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    const loadCategoryStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загрузка статистики по категориям
        const stats = await dashboardService.getCategoryStats();
        setCategoryStats(stats);
      } catch (err) {
        console.error('Error loading category statistics:', err);
        setError(t('admin.categoryStatsError'));
      } finally {
        setLoading(false);
      }
    };
    
    loadCategoryStats();
  }, [t]);
  
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>{t('admin.categoryStats')}</Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
          {categoryStats.length > 0 ? (
            categoryStats.map((category, index) => (
              <React.Fragment key={category.id}>
                <ListItem>
                  <ListItemText 
                    primary={category.name} 
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Chip 
                          icon={<LibraryBooksIcon />} 
                          label={t('admin.booksCount', { count: category.bookCount })}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip 
                          icon={<BookmarkIcon />} 
                          label={t('admin.borrowsCount', { count: category.borrowCount })}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {index < categoryStats.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary={t('admin.noCategories')} />
            </ListItem>
          )}
        </List>
      )}
    </Paper>
  );
};

export default CategoryStats;