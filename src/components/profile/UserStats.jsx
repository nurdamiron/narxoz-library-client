// src/components/profile/UserStats.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  MenuBook as BorrowIcon,
  WarningAmber as OverdueIcon,
  History as HistoryIcon,
  TrendingUp as StatsIcon
} from '@mui/icons-material';

// Импорт хуков
import { useProfile } from '../../hooks/useProfile';

const UserStats = () => {
  const { stats, loading } = useProfile();
  
  if (loading || !stats) {
    return (
      <Box sx={{ mt: 3, width: '100%' }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" gutterBottom>
          Статистика
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[0, 1, 2, 3].map((index) => (
            <Grid item xs={6} key={index}>
              <Skeleton variant="rectangular" height={80} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StatsIcon fontSize="small" color="primary" />
          Статистика
        </Typography>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
            component={RouterLink}
            to="/bookmarks"
            style={{ textDecoration: 'none' }}
          >
            <BookmarkIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
            <Typography variant="h5" color="text.primary">{stats.bookmarks || 0}</Typography>
            <Typography variant="caption" color="text.secondary">Бетбелгілер</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
            component={RouterLink}
            to="/borrows"
            style={{ textDecoration: 'none' }}
          >
            <BorrowIcon color="info" sx={{ fontSize: '2rem', mb: 1 }} />
            <Typography variant="h5" color="text.primary">{stats.activeborrows || 0}</Typography>
            <Typography variant="caption" color="text.secondary">Белсенді қарыздар</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
            component={RouterLink}
            to="/borrows"
            style={{ textDecoration: 'none' }}
          >
            <HistoryIcon color="secondary" sx={{ fontSize: '2rem', mb: 1 }} />
            <Typography variant="h5" color="text.primary">{stats.totalBorrows || 0}</Typography>
            <Typography variant="caption" color="text.secondary">Барлық қарыздар</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6}>
          <Paper 
            elevation={stats.overdueborrows > 0 ? 3 : 2} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: stats.overdueborrows > 0 ? 'error.lighter' : 'inherit',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
            component={RouterLink}
            to="/borrows?status=overdue"
            style={{ textDecoration: 'none' }}
          >
            <OverdueIcon 
              color={stats.overdueborrows > 0 ? 'error' : 'action'} 
              sx={{ fontSize: '2rem', mb: 1 }} 
            />
            <Typography 
              variant="h5" 
              color={stats.overdueborrows > 0 ? 'error.main' : 'text.primary'}
            >
              {stats.overdueborrows || 0}
            </Typography>
            <Typography 
              variant="caption" 
              color={stats.overdueborrows > 0 ? 'error.main' : 'text.secondary'}
            >
              Мерзімі өткен
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {stats.overdueborrows > 0 && (
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            component={RouterLink}
            to="/borrows?status=overdue"
            startIcon={<OverdueIcon />}
            size="small"
          >
            Мерзімі өткен кітаптарды қарау
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserStats;