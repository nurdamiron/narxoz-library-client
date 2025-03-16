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

/**
 * Бүйір панелі (Sidebar) енінің константасы
 * 
 * Бұл мән бүйір панелінің енін пикселде анықтайды
 * Material UI тақырыбында бірізділікті сақтау үшін жалпы мән ретінде қолданылады
 */
const drawerWidth = 240;

/**
 * Тестілік категориялар деректері
 * 
 * Кітаптар категориясының тестілік тізімі
 * Әрбір категория келесі қасиеттерден тұрады:
 * - id: Категорияның бірегей идентификаторы
 * - name: Категорияның атауы
 */
const categories = [
  { id: 1, name: 'Бизнес' },
  { id: 2, name: 'Экономика' },
  { id: 3, name: 'Финансы' },
  { id: 4, name: 'Маркетинг' },
  { id: 5, name: 'Менеджмент' },
  { id: 6, name: 'IT и программирование' },
  { id: 7, name: 'Право' },
];

/**
 * Sidebar компоненті - сайттың бүйір навигациялық панелі
 * 
 * Бұл компонент сайттың бүйір панелін құрайды және келесі элементтерді қамтиды:
 * - Басты навигациялық сілтемелер (басты бет, барлық кітаптар, т.б.)
 * - Кітаптар категориясының тізімі
 * - Қосымша сілтемелер (көмек, кітапхана туралы)
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {boolean} props.open - Бүйір панелінің ашық/жабық күйі
 * @param {Function} props.onClose - Бүйір панелін жабу функциясы
 */
const Sidebar = ({ open, onClose }) => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const location = useLocation(); // Ағымдағы URL орнын алу

  /**
   * Негізгі меню элементтерінің тізімі
   * 
   * Бұл массив негізгі навигациялық элементтерді сақтайды:
   * - text: Сілтеме мәтіні
   * - icon: Сілтеме иконкасы (React элементі)
   * - path: Сілтеме маршруты
   */
  const mainMenuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/' },
    { text: 'Все книги', icon: <LibraryBooksIcon />, path: '/books' },
    { text: 'Популярные', icon: <StarRateIcon />, path: '/books?popular=true' },
  ];

  /**
   * Қосымша меню элементтерінің тізімі
   * 
   * Бұл массив қосымша навигациялық элементтерді сақтайды:
   * - text: Сілтеме мәтіні
   * - icon: Сілтеме иконкасы (React элементі)
   * - path: Сілтеме маршруты
   */
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
      variant="persistent" // Тұрақты бүйір панелі (жабылғанда толығымен жойылмайды)
      anchor="left" // Панельді сол жақта орналастыру
      open={open} // Ашық/жабық күйін басқару
    >
      {/* Бүйір панелінің тақырыбы (logo мен жабу түймесі) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar, // Жоғарғы панельмен бірдей биіктік
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
        {/* Бүйір панелін жабу түймесі */}
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider /> {/* Бөлгіш сызық */}

      {/* Негізгі меню элементтерінің тізімі */}
      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink} // React Router сілтемесін қолдану
              to={item.path} // Сілтеме маршруты
              selected={location.pathname === item.path} // Ағымдағы бетті белгілеу
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(21, 101, 192, 0.12)', // Таңдалған элемент фоны
                  borderLeft: `4px solid ${theme.palette.primary.main}`, // Таңдалған элементтің сол жақ шекарасы
                  '&:hover': {
                    backgroundColor: 'rgba(21, 101, 192, 0.18)', // Таңдалған элементтің үстінен өткендегі фоны
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

      <Divider /> {/* Бөлгіш сызық - негізгі меню мен категориялар арасында */}

      {/* Категориялар тақырыбы */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          Категории
        </Typography>
      </Box>

      {/* Категориялар тізімі (айналмалы тізім - скроллмен) */}
      <List sx={{ maxHeight: '30vh', overflow: 'auto' }}>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={`/books?category=${category.id}`} // Категория фильтрімен URL
              selected={location.search.includes(`category=${category.id}`)} // Таңдалған категорияны белгілеу
              sx={{
                pl: 3, // Қосымша сол жақ padding (иерархияны көрсету үшін)
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
                <CategoryIcon fontSize="small" /> {/* Категория иконкасы */}
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Көмекші элемент - қосымша элементтерді төменге итермелеу үшін */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider /> {/* Бөлгіш сызық - қосымша меню үшін */}

      {/* Қосымша меню элементтерінің тізімі */}
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