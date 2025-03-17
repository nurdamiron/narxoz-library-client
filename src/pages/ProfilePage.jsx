import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  useTheme,
  Typography,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import {
  Edit as EditIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  NotificationsActive as NotificationsIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// Import components
import ProfileCard from '../components/profile/ProfileCard';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import BookmarksList from '../components/profile/BookmarksList';
import CurrentBooksList from '../components/profile/CurrentBooksList';
import NotificationsList from '../components/profile/NotificationsList';
import ConfirmDialog from '../components/common/ConfirmDialog';

// Import mock data
import { 
  mockUser, 
  mockBookmarks, 
  mockCurrentBooks, 
  mockNotifications
} from '../data/mockData';

/**
 * ProfilePage component with responsive tabs
 */
const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Tab state
  const [currentTab, setCurrentTab] = useState('1');
  
  // Mobile menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  
  // User data states
  const [userData, setUserData] = useState(mockUser);
  const [editedUserData, setEditedUserData] = useState(mockUser);
  
  // Component data states
  const [bookmarks, setBookmarks] = useState(mockBookmarks);
  const [currentBooks, setCurrentBooks] = useState(mockCurrentBooks);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBookForReturn, setSelectedBookForReturn] = useState(null);
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Tab configuration (used for both tabs and mobile menu)
  const tabItems = [
    { value: '1', label: 'Профиль', icon: <EditIcon /> },
    { value: '2', label: 'Закладки', icon: <BookmarkIcon /> },
    { value: '3', label: 'Мои книги', icon: <HistoryIcon /> },
    { value: '4', label: 'Уведомления', icon: <NotificationsIcon /> },
  ];
  
  /**
   * Show a snackbar notification
   */
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  /**
   * Handle tab change
   */
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    handleCloseMenu(); // Close mobile menu if open
  };
  
  /**
   * Handle opening mobile menu
   */
  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  /**
   * Handle closing mobile menu
   */
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };
  
  /**
   * Handle tab select from mobile menu
   */
  const handleMenuItemClick = (value) => {
    setCurrentTab(value);
    handleCloseMenu();
  };
  
  /**
   * Handle edit button click
   */
  const handleEditProfile = () => {
    setEditMode(true);
    setEditedUserData(userData);
    // Switch to profile tab if on another tab
    if (currentTab !== '1') {
      setCurrentTab('1');
    }
  };
  
  /**
   * Handle cancel edit
   */
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedUserData(userData);
  };
  
  /**
   * Handle save profile
   */
  const handleSaveProfile = () => {
    setUserData(editedUserData);
    setEditMode(false);
    showSnackbar('Профиль успешно обновлен');
  };
  
  /**
   * Handle input data change
   */
  const handleInputChange = (name, value) => {
    setEditedUserData({
      ...editedUserData,
      [name]: value,
    });
  };
  
  /**
   * Handle return book request
   */
  const handleReturnBook = (book) => {
    setSelectedBookForReturn(book);
    setDialogOpen(true);
  };
  
  /**
   * Handle confirm return
   */
  const handleConfirmReturn = () => {
    setCurrentBooks(currentBooks.filter(book => book.id !== selectedBookForReturn.id));
    setDialogOpen(false);
    showSnackbar('Книга успешно возвращена');
  };
  
  /**
   * Handle remove bookmark
   */
  const handleRemoveBookmark = (bookmarkId) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
    showSnackbar('Закладка удалена', 'info');
  };
  
  /**
   * Handle mark notification as read
   */
  const handleReadNotification = (notificationId) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Get the current tab label
  const getCurrentTabLabel = () => {
    const tab = tabItems.find(item => item.value === currentTab);
    return tab ? tab.label : '';
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
        Профиль пользователя
      </Typography>
      
      <Grid container spacing={4}>
        {/* Left column - User information */}
        <Grid item xs={12} md={4}>
          <ProfileCard 
            userData={userData} 
            onEditClick={handleEditProfile} 
          />
        </Grid>
        
        {/* Right column - Tabs */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              borderRadius: 3,
              boxShadow: theme.shadows[2],
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <TabContext value={currentTab}>
              {/* Tab headers - different for mobile and desktop */}
              {isMobile ? (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  px: 2, 
                  py: 1.5,
                  borderBottom: 1, 
                  borderColor: 'divider' 
                }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {getCurrentTabLabel()}
                  </Typography>
                  <IconButton
                    aria-label="more options"
                    aria-controls="tab-menu"
                    aria-haspopup="true"
                    onClick={handleOpenMenu}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="tab-menu"
                    anchorEl={menuAnchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    PaperProps={{
                      elevation: 2,
                      sx: { width: 200, maxWidth: '100%', borderRadius: 2 }
                    }}
                  >
                    {tabItems.map((item) => (
                      <MenuItem 
                        key={item.value}
                        onClick={() => handleMenuItemClick(item.value)}
                        selected={currentTab === item.value}
                        sx={{
                          borderRadius: 1,
                          mx: 0.5,
                          my: 0.25,
                          '&.Mui-selected': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(213, 0, 50, 0.2)' 
                              : 'rgba(213, 0, 50, 0.1)',
                            color: '#d50032',
                          }
                        }}
                      >
                        <ListItemIcon sx={{ color: currentTab === item.value ? '#d50032' : 'inherit' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="profile tabs"
                    variant="fullWidth"
                    sx={{
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#d50032',
                        height: 3,
                      },
                      '& .Mui-selected': {
                        color: '#d50032',
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    {tabItems.map((tab) => (
                      <Tab
                        key={tab.value}
                        icon={tab.icon}
                        iconPosition="start"
                        label={tab.label}
                        value={tab.value}
                      />
                    ))}
                  </Tabs>
                </Box>
              )}
              
              {/* Tab panels */}
              <TabPanel value="1" sx={{ p: 0 }}>
                <ProfileEditForm 
                  userData={editedUserData}
                  onDataChange={handleInputChange}
                  onSave={handleSaveProfile}
                  onCancel={handleCancelEdit}
                  editMode={editMode}
                />
              </TabPanel>
              
              <TabPanel value="2" sx={{ p: 0 }}>
                <BookmarksList 
                  bookmarks={bookmarks}
                  onRemoveBookmark={handleRemoveBookmark}
                />
              </TabPanel>
              
              <TabPanel value="3" sx={{ p: 0 }}>
                <CurrentBooksList 
                  books={currentBooks}
                  onReturnBook={handleReturnBook}
                />
              </TabPanel>
              
              <TabPanel value="4" sx={{ p: 0 }}>
                <NotificationsList 
                  notifications={notifications}
                  onReadNotification={handleReadNotification}
                />
              </TabPanel>
            </TabContext>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Confirmation dialog */}
      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmReturn}
        title="Подтверждение возврата книги"
        message={`Вы уверены, что хотите вернуть книгу "${selectedBookForReturn?.title}"?`}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;