import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import dashboardService from '../../../services/dashboardService';

const CategoryStats = () => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        setError('Категория статистикасын жүктеу кезінде қате пайда болды');
      } finally {
        setLoading(false);
      }
    };
    
    loadCategoryStats();
  }, []);
  
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Категория бойынша статистика</Typography>
      
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
                          label={`${category.bookCount} кітап`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip 
                          icon={<BookmarkIcon />} 
                          label={`${category.borrowCount} қарыз`}
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
              <ListItemText primary="Категориялар табылмады" />
            </ListItem>
          )}
        </List>
      )}
    </Paper>
  );
};

export default CategoryStats;