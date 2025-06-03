import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Badge,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Book as BookIcon,
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  RateReview as ReviewIcon,
  Event as EventIcon,
  Dashboard as DashboardIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/common/PageHeader';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const dashboardItems = [
    {
      title: t('profile.title'),
      description: t('userDashboard.profileDesc'),
      icon: PersonIcon,
      path: '/profile',
      color: '#2196f3',
      stats: { }
    },
    {
      title: t('notifications.title'),
      description: t('userDashboard.notificationsDesc'),
      icon: NotificationsIcon,
      path: '/notifications',
      color: '#ff5722',
      stats: { unread: 3, total: 25 }
    },
    {
      title: t('userDashboard.myBooks'),
      description: t('userDashboard.myBooksDesc'),
      icon: BookIcon,
      path: '/borrows',
      color: '#1976d2',
      stats: { active: 3, total: 15 }
    },
    {
      title: t('userDashboard.myBookmarks'),
      description: t('userDashboard.myBookmarksDesc'),
      icon: BookmarkIcon,
      path: '/bookmarks',
      color: '#f50057',
      stats: { total: 8 }
    },
    {
      title: t('userDashboard.myReviews'),
      description: t('userDashboard.myReviewsDesc'),
      icon: ReviewIcon,
      path: '/my-reviews',
      color: '#ff6f00',
      stats: { total: 12, pending: 2 }
    },
    {
      title: t('userDashboard.myEvents'),
      description: t('userDashboard.myEventsDesc'),
      icon: EventIcon,
      path: '/user-events-manager',
      color: '#4caf50',
      stats: { upcoming: 2, total: 7 }
    },
    {
      title: t('userDashboard.borrowHistory'),
      description: t('userDashboard.borrowHistoryDesc'),
      icon: HistoryIcon,
      path: '/borrows?tab=history',
      color: '#9c27b0',
      stats: { total: 25 }
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title={t('userDashboard.title')}
        subtitle={t('userDashboard.subtitle', { name: user?.firstName || t('user.fullName') })}
        icon={<DashboardIcon />}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          aria-label="user dashboard tabs"
        >
          <Tab label={t('userDashboard.overview')} />
          <Tab label={t('userDashboard.statistics')} />
          <Tab label={t('userDashboard.settings')} />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardActionArea onClick={() => navigate(item.path)} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ 
                        backgroundColor: `${item.color}20`,
                        borderRadius: 2,
                        p: 1.5,
                        display: 'inline-flex',
                      }}>
                        <item.icon sx={{ color: item.color, fontSize: 32 }} />
                      </Box>
                      <IconButton size="small" sx={{ mt: -1, mr: -1 }}>
                        <ArrowForwardIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {item.stats.active !== undefined && (
                        <Typography variant="caption" sx={{ 
                          backgroundColor: '#e3f2fd', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          color: '#1976d2'
                        }}>
                          {t('userDashboard.active')}: {item.stats.active}
                        </Typography>
                      )}
                      {item.stats.upcoming !== undefined && (
                        <Typography variant="caption" sx={{ 
                          backgroundColor: '#e8f5e9', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          color: '#4caf50'
                        }}>
                          {t('userDashboard.upcoming')}: {item.stats.upcoming}
                        </Typography>
                      )}
                      {item.stats.pending !== undefined && (
                        <Typography variant="caption" sx={{ 
                          backgroundColor: '#fff3e0', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          color: '#ff6f00'
                        }}>
                          {t('userDashboard.pending')}: {item.stats.pending}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {t('userDashboard.total')}: {item.stats.total}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('userDashboard.quickStats')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">15</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('userDashboard.totalBorrowed')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary">8</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('userDashboard.savedBooks')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#ff6f00' }}>12</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('userDashboard.reviewsWritten')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#4caf50' }}>7</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('userDashboard.eventsAttended')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" gutterBottom>
          {t('userDashboard.comingSoon')}
        </Typography>
        <Typography color="text.secondary">
          {t('userDashboard.statisticsComingSoon')}
        </Typography>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6" gutterBottom>
          {t('userDashboard.comingSoon')}
        </Typography>
        <Typography color="text.secondary">
          {t('userDashboard.settingsComingSoon')}
        </Typography>
      </TabPanel>
    </Container>
  );
};

export default UserDashboard;