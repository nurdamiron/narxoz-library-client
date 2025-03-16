import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  InputBase,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme,
  styled,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Person,
  Book,
  History,
} from '@mui/icons-material';

/**
 * Іздеу компонентінің стильдері
 * 
 * Бұл компонент іздеу өрісінің сыртқы контейнері болып табылады
 * Жарқыраған фондық түсі бар дөңгелектелген жиектер қолданылады
 */
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.15)', // Ашық ақ фон
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Үстінен өткенде фон түсі
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

/**
 * Іздеу иконкасының контейнері
 * 
 * Іздеу иконкасын іздеу өрісінің сол жағына орналастырады
 */
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none', // Курсор әрекеттерін өткізеді
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

/**
 * Іздеу енгізу өрісінің стильдері
 * 
 * Іздеу мәтінін енгізу өрісін стильдейді
 * Фокус кезінде өріс ені ұлғаяды
 */
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`, // Іздеу иконкасына орын қалдыру
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch', // Әдепкі ені
      '&:focus': {
        width: '30ch', // Фокус кезіндегі ені
      },
    },
  },
}));

/**
 * Header компоненті - сайттың жоғарғы навигациялық панелі
 * 
 * Бұл компонент сайттың жоғарғы панелін (хедерін) құрайды және келесі элементтерді қамтиды:
 * - Сайт логотипі мен атауы
 * - Бүйір панелін ашатын түйме
 * - Іздеу өрісі
 * - Каталог түймесі (үлкен экрандарда)
 * - Хабарландырулар түймесі
 * - Пайдаланушы профиль түймесі мен меню
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Function} props.toggleSidebar - Бүйір панелін ашу/жабу функциясы
 */
const Header = ({ toggleSidebar }) => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Экран өлшемін тексеру
  const navigate = useNavigate(); // Маршруттау функциясы
  
  // Компонент күйлері (state)
  const [anchorEl, setAnchorEl] = useState(null); // Пайдаланушы менюсінің орналасуы
  const [searchQuery, setSearchQuery] = useState(''); // Іздеу сұранысы
  
  // Тестілік аутентификация деректері
  // Шынайы қосымшада бұл деректер сервер жауабынан немесе Redux күйінен алынады
  const [isAuthenticated] = useState(true); // Пайдаланушы кірген/кірмеген
  const [user] = useState({
    name: 'Айдар Тестов',
    email: 'aidar@test.com',
    avatar: null, // Аватар суреті
  });

  /**
   * Пайдаланушы профилі менюсін ашу
   * 
   * @param {Event} event - Түйме басу оқиғасы
   */
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Менюдің орналасуын орнату
  };

  /**
   * Пайдаланушы профилі менюсін жабу
   */
  const handleMenuClose = () => {
    setAnchorEl(null); // Меню орналасуын тазалау
  };

  /**
   * Пайдаланушы жүйеден шығу функциясы
   * 
   * Бұл функция пайдаланушыны жүйеден шығарып, басты бетке бағыттайды
   */
  const handleLogout = () => {
    // Жүйеден шығуды имитациялау (нақты қосымшада аутентификация қызметін шақыру керек)
    handleMenuClose(); // Меню жабу
    navigate('/'); // Басты бетке өту
  };

  /**
   * Іздеу функциясы
   * 
   * @param {Event} e - Пернетақта оқиғасы
   * Егер Enter пернесі басылса және іздеу сұранысы бос болмаса,
   * пайдаланушы іздеу нәтижелері бетіне бағытталады
   */
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Іздеу өрісін тазалау
    }
  };

  return (
    <AppBar position="fixed"> {/* Бекітілген жоғарғы панель */}
      <Toolbar>
        {/* Бүйір панелін ашу түймесі */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Сайт логотипі мен атауы */}
        <Typography
          variant="h6"
          noWrap
          component={RouterLink}
          to="/"
          sx={{
            display: { xs: 'none', sm: 'block' }, // Кішкентай экрандарда жасыру
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          НАРХОЗ Библиотека
        </Typography>

        {/* Іздеу компоненті */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Поиск книг..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Іздеу сұранысын жаңарту
            onKeyDown={handleSearch} // Enter пернесіне әрекет ету
          />
        </Search>

        {/* Бос орын - элементтерді оң жаққа итермелеу үшін */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Оң жақ элементтер тобы */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Каталог түймесі - тек үлкен экрандарда */}
          {!isMobile && (
            <Button
              color="inherit"
              component={RouterLink}
              to="/books"
              startIcon={<Book />}
              sx={{ mr: 1 }}
            >
              Каталог
            </Button>
          )}

          {/* Аутентификацияланған пайдаланушы элементтері */}
          {isAuthenticated ? (
            <>
              {/* Хабарландырулар түймесі */}
              <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={3} color="error"> {/* 3 оқылмаған хабарландыру */}
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Пайдаланушы профилі түймесі */}
              <Tooltip title="Аккаунт">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {user.avatar ? (
                    <Avatar
                      alt={user.name}
                      src={user.avatar}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircle /> // Әдепкі аватар иконкасы
                  )}
                </IconButton>
              </Tooltip>

              {/* Пайдаланушы профилі менюсі */}
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)} // Меню ашық/жабық күйі
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* Профиль бетіне сілтеме */}
                <MenuItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleMenuClose}
                >
                  <Person sx={{ mr: 1 }} /> Профиль
                </MenuItem>
                {/* Тарих бетіне сілтеме */}
                <MenuItem
                  component={RouterLink}
                  to="/history"
                  onClick={handleMenuClose}
                >
                  <History sx={{ mr: 1 }} /> История
                </MenuItem>
                {/* Жүйеден шығу түймесі */}
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Выйти
                </MenuItem>
              </Menu>
            </>
          ) : (
            // Аутентификацияланбаған пайдаланушы үшін кіру түймесі
            <Button color="inherit" component={RouterLink} to="/login">
              Войти
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;