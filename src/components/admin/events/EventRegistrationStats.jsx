/**
 * Event Registration Statistics Component
 * 
 * Displays detailed statistics and analytics for event registrations
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const EventRegistrationStats = ({ event, registrations }) => {
  const { t } = useTranslation();

  if (!event || !registrations) {
    return null;
  }

  // Calculate statistics
  const totalRegistrations = registrations.length;
  const registeredCount = registrations.filter(r => r.status === 'registered' || r.status === 'attended').length;
  const attendedCount = registrations.filter(r => r.status === 'attended').length;
  const cancelledCount = registrations.filter(r => r.status === 'cancelled').length;
  
  const capacity = event.capacity;
  const availableSpots = capacity - registeredCount;
  const fillRate = (registeredCount / capacity) * 100;
  const attendanceRate = registeredCount > 0 ? (attendedCount / registeredCount) * 100 : 0;
  const cancellationRate = totalRegistrations > 0 ? (cancelledCount / totalRegistrations) * 100 : 0;

  // Analyze registration timing
  const now = new Date();
  const eventStart = new Date(event.startDate);
  const isEventPast = now > eventStart;
  
  // Group registrations by time periods
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const registrationsToday = registrations.filter(r => new Date(r.registrationDate) >= today).length;
  const registrationsYesterday = registrations.filter(r => {
    const regDate = new Date(r.registrationDate);
    return regDate >= yesterday && regDate < today;
  }).length;
  const registrationsLastWeek = registrations.filter(r => new Date(r.registrationDate) >= lastWeek).length;

  // Role distribution
  const roleDistribution = registrations.reduce((acc, registration) => {
    const role = registration.user?.role || 'unknown';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const StatCard = ({ icon, title, value, subtitle, color = 'primary', progress }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              mr: 2, 
              p: 1, 
              borderRadius: 1, 
              bgcolor: `${color}.main`, 
              color: 'white',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {progress !== undefined && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Статистика регистраций
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<GroupIcon />}
            title="Зарегистрировано"
            value={registeredCount}
            subtitle={`из ${capacity} мест`}
            color="primary"
            progress={fillRate}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EventIcon />}
            title="Присутствовали"
            value={attendedCount}
            subtitle={`${attendanceRate.toFixed(1)}% посещаемость`}
            color="success"
            progress={attendanceRate}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CancelIcon />}
            title="Отменили"
            value={cancelledCount}
            subtitle={`${cancellationRate.toFixed(1)}% отказов`}
            color="error"
            progress={cancellationRate}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon />}
            title="Доступно мест"
            value={availableSpots}
            subtitle={fillRate >= 90 ? 'Почти заполнено' : fillRate >= 50 ? 'Хорошая заполненность' : 'Много свободных мест'}
            color={availableSpots <= 3 ? 'error' : availableSpots <= 10 ? 'warning' : 'success'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Registration Timeline */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Динамика регистраций
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Сегодня</Typography>
                  <Chip 
                    label={registrationsToday} 
                    size="small" 
                    color={registrationsToday > 0 ? 'primary' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Вчера</Typography>
                  <Chip 
                    label={registrationsYesterday} 
                    size="small" 
                    color={registrationsYesterday > 0 ? 'primary' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">За последнюю неделю</Typography>
                  <Chip 
                    label={registrationsLastWeek} 
                    size="small" 
                    color={registrationsLastWeek > 0 ? 'primary' : 'default'}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Распределение по ролям
              </Typography>
              <Stack spacing={2}>
                {Object.entries(roleDistribution).map(([role, count]) => (
                  <Box key={role} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {role === 'student' ? 'Студенты' : 
                       role === 'faculty' ? 'Преподаватели' :
                       role === 'staff' ? 'Сотрудники' :
                       role === 'admin' ? 'Администраторы' :
                       role === 'moderator' ? 'Модераторы' : 
                       'Другие'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={count} 
                        size="small" 
                        color="primary"
                      />
                      <Typography variant="caption" color="text.secondary">
                        ({((count / totalRegistrations) * 100).toFixed(0)}%)
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventRegistrationStats;