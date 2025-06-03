import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
} from '@mui/material';
import {
  Event as EventIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import eventService from '../services/eventService';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`events-tabpanel-${index}`}
      aria-labelledby={`events-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const UserEventsManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [events, setEvents] = useState({
    upcoming: [],
    past: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  const [cancelDialog, setCancelDialog] = useState({ open: false, event: null });
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    attended: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getMyEvents();
      
      const upcomingEvents = response.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate > new Date() && event.registrationStatus !== 'cancelled';
      });
      
      const pastEvents = response.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate <= new Date() && event.registrationStatus !== 'cancelled';
      });
      
      const cancelledEvents = response.filter(event => 
        event.registrationStatus === 'cancelled'
      );
      
      setEvents({
        upcoming: upcomingEvents,
        past: pastEvents,
        cancelled: cancelledEvents
      });
      
      setStats({
        total: response.length,
        upcoming: upcomingEvents.length,
        attended: pastEvents.filter(e => e.registrationStatus === 'attended').length,
        cancelled: cancelledEvents.length
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast(t('userEventsManager.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const getCurrentEvents = () => {
    switch (activeTab) {
      case 0: return events.upcoming;
      case 1: return events.past;
      case 2: return events.cancelled;
      default: return [];
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCancelClick = (event) => {
    setCancelDialog({ open: true, event });
  };

  const handleCancelConfirm = async () => {
    try {
      await eventService.cancelRegistration(cancelDialog.event.id);
      showToast(t('userEventsManager.cancelSuccess'), 'success');
      setCancelDialog({ open: false, event: null });
      fetchMyEvents();
    } catch (error) {
      showToast(t('userEventsManager.cancelError'), 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'registered':
        return 'primary';
      case 'attended':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatEventDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  const currentEvents = getCurrentEvents();
  const displayedEvents = currentEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LoadingSkeleton rows={6} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title={t('userEventsManager.title')}
        subtitle={t('userEventsManager.subtitle')}
        icon={<EventIcon />}
        action={
          <Button
            variant="contained"
            component={RouterLink}
            to="/user-dashboard"
            startIcon={<DashboardIcon />}
          >
            {t('userEventsManager.backToDashboard')}
          </Button>
        }
      />

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('userEventsManager.totalEvents')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.upcoming}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('userEventsManager.upcomingEvents')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.attended}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('userEventsManager.attendedEvents')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <CancelIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.cancelled}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('userEventsManager.cancelledEvents')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="events tabs">
            <Tab 
              label={`${t('userEventsManager.upcoming')} (${events.upcoming.length})`} 
              icon={<ScheduleIcon />}
            />
            <Tab 
              label={`${t('userEventsManager.past')} (${events.past.length})`} 
              icon={<HistoryIcon />}
            />
            <Tab 
              label={`${t('userEventsManager.cancelled')} (${events.cancelled.length})`} 
              icon={<CancelIcon />}
            />
          </Tabs>
        </Box>

        {currentEvents.length === 0 ? (
          <Box sx={{ p: 4 }}>
            <EmptyState
              message={t('userEventsManager.noEvents')}
              action={
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/events"
                >
                  {t('userEventsManager.browseEvents')}
                </Button>
              }
            />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('userEventsManager.eventName')}</TableCell>
                    <TableCell>{t('userEventsManager.type')}</TableCell>
                    <TableCell>{t('userEventsManager.date')}</TableCell>
                    <TableCell>{t('userEventsManager.location')}</TableCell>
                    <TableCell align="center">{t('userEventsManager.status')}</TableCell>
                    <TableCell align="center">{t('userEventsManager.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {event.title}
                          </Typography>
                          {event.description && (
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                              }}
                            >
                              {event.description}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`events.types.${event.type}`)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatEventDate(event.startDate)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography 
                            variant="body2"
                            sx={{
                              maxWidth: 150,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={event.location}
                          >
                            {event.location}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={t(`userEventsManager.eventStatusTypes.${event.registrationStatus || 'registered'}`)}
                          color={getStatusColor(event.registrationStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={t('userEventsManager.view')}>
                          <IconButton
                            size="small"
                            component={RouterLink}
                            to={`/events/${event.id}`}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {activeTab === 0 && event.registrationStatus === 'registered' && (
                          <Tooltip title={t('userEventsManager.cancel')}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleCancelClick(event)}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={currentEvents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Cancel Dialog */}
      <Dialog 
        open={cancelDialog.open} 
        onClose={() => setCancelDialog({ open: false, event: null })} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>{t('userEventsManager.cancelRegistration')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('userEventsManager.cancelConfirm', { title: cancelDialog.event?.title })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, event: null })}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained">
            {t('userEventsManager.confirmCancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserEventsManager;