import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  Category as CategoryIcon,
  StarRate as StarRateIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

// Тестовые данные для категорий
const categories = [
  { id: 1, name: 'Бизнес' },
  { id: 2, name: 'Экономика' },
  { id: 3, name: 'Финансы' },
  { id: 4, name: 'Маркетинг' },
  { id: 5, name: 'Менеджмент' },
  { id: 6, name: 'IT и программирование' },
  { id: 7, name: 'Право' },
];

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const location = useLocation();

  const mainMenuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/' },
    { text: 'Все книги', icon: <LibraryBooksIcon />, path: '/books' },
    { text: 'Популярные', icon: <StarRateIcon />, path: '/books?popular=true' },
  ];

  const secondaryMenuItems = [
    { text: 'О библиотеке', icon: <InfoIcon />, path: '/about' },
    { text: 'Помощь', icon: <HelpIcon />, path: '/help' },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar,
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            ml: 2,
          }}
        >
          НАРХОЗ Library
        </Typography>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider />

      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(21, 101, 192, 0.12)',
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: 'rgba(21, 101, 192, 0.18)',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          Категории
        </Typography>
      </Box>

      <List sx={{ maxHeight: '30vh', overflow: 'auto' }}>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={`/books?category=${category.id}`}
              selected={location.search.includes(`category=${category.id}`)}
              sx={{
                pl: 3,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(21, 101, 192, 0.12)',
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: 'rgba(21, 101, 192, 0.18)',
                  },
                },
              }}
            >
              <ListItemIcon>
                <CategoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;