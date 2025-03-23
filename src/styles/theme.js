// src/styles/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { alpha } from '@mui/material';

/**
 * Университеттің түс схемасы
 * Негізгі түс: Қызыл (#d50032) - университеттің бренд түсі
 * Қосымша түс: Ашық қызыл (#ff5252) - әсерлі акценттер үшін
 * Бұл түстер университеттің корпоративтік стилін сақтай отырып, 
 * заманауи және әсерлі интерфейс жасауға мүмкіндік береді.
 */

// Негізгі түстер жиынтығы
const primaryColor = '#d50032';
const secondaryColor = '#ff5252';

const colorScheme = {
  primary: {
    main: '#d50032',      // Негізгі қызыл түс
    light: '#ff5c5d',     // Ашық қызыл
    dark: '#9b0000',      // Қою қызыл
    contrastText: '#fff', // Контрастты ақ мәтін
  },
  secondary: {
    main: '#ff5252',      // Қосымша қызыл түс
    light: '#ff867f',     // Ашық қосымша түс
    dark: '#c50e29',      // Қою қосымша түс
    contrastText: '#fff', // Контрастты ақ мәтін
  },
}

// Жаңартылған түс градиенттері үлгілері
const gradientExamples = {
  // Негізгі градиент - тік
  primaryVertical: `linear-gradient(to bottom, ${colorScheme.primary.main}, ${colorScheme.primary.dark})`,
  
  // Негізгі градиент - көлденең
  primaryHorizontal: `linear-gradient(to right, ${colorScheme.primary.main}, ${colorScheme.secondary.main})`,
  
  // Фон градиенті
  backgroundGradient: `linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)`,
  
  // Карточка градиенті
  cardGradient: `linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)`,
}

// Қараңғы режим үшін түстерді баптау
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: primaryColor,
      light: '#ff5c5d',
      dark: '#9b0000',
      contrastText: '#fff',
    },
    secondary: {
      main: secondaryColor,
      light: '#ff867f',
      dark: '#c50e29',
      contrastText: '#fff',
    },
    background: {
      default: mode === 'light' ? '#f8f9fa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      subtle: mode === 'light' ? '#f5f5f5' : '#2d2d2d',
    },
    text: {
      primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
      secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      disabled: mode === 'light' ? 'rgba(0, 0, 0, 0.38)' : 'rgba(255, 255, 255, 0.38)',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    action: {
      hover: mode === 'light' 
        ? alpha(primaryColor, 0.04) 
        : alpha(primaryColor, 0.12),
      selected: mode === 'light' 
        ? alpha(primaryColor, 0.08) 
        : alpha(primaryColor, 0.16),
      disabled: mode === 'light' 
        ? 'rgba(0, 0, 0, 0.26)' 
        : 'rgba(255, 255, 255, 0.3)',
      disabledBackground: mode === 'light' 
        ? 'rgba(0, 0, 0, 0.12)' 
        : 'rgba(255, 255, 255, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02857em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.16667em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.06),0px 1px 1px 0px rgba(0,0,0,0.042),0px 1px 3px 0px rgba(0,0,0,0.036)',
    '0px 3px 1px -2px rgba(0,0,0,0.06),0px 2px 2px 0px rgba(0,0,0,0.042),0px 1px 5px 0px rgba(0,0,0,0.036)',
    '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.042),0px 1px 8px 0px rgba(0,0,0,0.036)',
    '0px 2px 4px -1px rgba(0,0,0,0.06),0px 4px 5px 0px rgba(0,0,0,0.042),0px 1px 10px 0px rgba(0,0,0,0.036)',
    '0px 3px 5px -1px rgba(0,0,0,0.06),0px 5px 8px 0px rgba(0,0,0,0.042),0px 1px 14px 0px rgba(0,0,0,0.036)',
    '0px 3px 5px -1px rgba(0,0,0,0.06),0px 6px 10px 0px rgba(0,0,0,0.042),0px 1px 18px 0px rgba(0,0,0,0.036)',
    '0px 4px 5px -2px rgba(0,0,0,0.06),0px 7px 10px 1px rgba(0,0,0,0.042),0px 2px 16px 1px rgba(0,0,0,0.036)',
    '0px 5px 5px -3px rgba(0,0,0,0.06),0px 8px 10px 1px rgba(0,0,0,0.042),0px 3px 14px 2px rgba(0,0,0,0.036)',
    '0px 5px 6px -3px rgba(0,0,0,0.06),0px 9px 12px 1px rgba(0,0,0,0.042),0px 3px 16px 2px rgba(0,0,0,0.036)',
    '0px 6px 6px -3px rgba(0,0,0,0.06),0px 10px 14px 1px rgba(0,0,0,0.042),0px 4px 18px 3px rgba(0,0,0,0.036)',
    '0px 6px 7px -4px rgba(0,0,0,0.06),0px 11px 15px 1px rgba(0,0,0,0.042),0px 4px 20px 3px rgba(0,0,0,0.036)',
    '0px 7px 8px -4px rgba(0,0,0,0.06),0px 12px 17px 2px rgba(0,0,0,0.042),0px 5px 22px 4px rgba(0,0,0,0.036)',
    '0px 7px 8px -4px rgba(0,0,0,0.06),0px 13px 19px 2px rgba(0,0,0,0.042),0px 5px 24px 4px rgba(0,0,0,0.036)',
    '0px 7px 9px -4px rgba(0,0,0,0.06),0px 14px 21px 2px rgba(0,0,0,0.042),0px 5px 26px 4px rgba(0,0,0,0.036)',
    '0px 8px 9px -5px rgba(0,0,0,0.06),0px 15px 22px 2px rgba(0,0,0,0.042),0px 6px 28px 5px rgba(0,0,0,0.036)',
    '0px 8px 10px -5px rgba(0,0,0,0.06),0px 16px 24px 2px rgba(0,0,0,0.042),0px 6px 30px 5px rgba(0,0,0,0.036)',
    '0px 8px 11px -5px rgba(0,0,0,0.06),0px 17px 26px 2px rgba(0,0,0,0.042),0px 6px 32px 5px rgba(0,0,0,0.036)',
    '0px 9px 11px -5px rgba(0,0,0,0.06),0px 18px 28px 2px rgba(0,0,0,0.042),0px 7px 34px 6px rgba(0,0,0,0.036)',
    '0px 9px 12px -6px rgba(0,0,0,0.06),0px 19px 29px 2px rgba(0,0,0,0.042),0px 7px 36px 6px rgba(0,0,0,0.036)',
    '0px 10px 13px -6px rgba(0,0,0,0.06),0px 20px 31px 3px rgba(0,0,0,0.042),0px 8px 38px 7px rgba(0,0,0,0.036)',
    '0px 10px 13px -6px rgba(0,0,0,0.06),0px 21px 33px 3px rgba(0,0,0,0.042),0px 8px 40px 7px rgba(0,0,0,0.036)',
    '0px 10px 14px -6px rgba(0,0,0,0.06),0px 22px 35px 3px rgba(0,0,0,0.042),0px 8px 42px 7px rgba(0,0,0,0.036)',
    '0px 11px 14px -7px rgba(0,0,0,0.06),0px 23px 36px 3px rgba(0,0,0,0.042),0px 9px 44px 8px rgba(0,0,0,0.036)',
    '0px 11px 15px -7px rgba(0,0,0,0.06),0px 24px 38px 3px rgba(0,0,0,0.042),0px 9px 46px 8px rgba(0,0,0,0.036)',
  ],
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s',
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(0)',
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: alpha(primaryColor, 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(primaryColor, 0.7),
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '16px 0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          '&.Mui-selected': {
            backgroundColor: mode === 'light' 
              ? alpha(primaryColor, 0.12) 
              : alpha(primaryColor, 0.2),
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? alpha(primaryColor, 0.18) 
                : alpha(primaryColor, 0.28),
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          '&.MuiChip-filled': {
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        filledSuccess: {
          fontWeight: 500, 
        },
        filledError: {
          fontWeight: 500,
        },
        filledWarning: {
          fontWeight: 500,
        },
        filledInfo: {
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

// Тақырыпты құру және оны біріктіру
let theme = createTheme(getDesignTokens('light'));

// Адаптивті шрифт өлшемдерін қосу
theme = responsiveFontSizes(theme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
  factor: 2, // Өлшем өзгерісінің факторы
});

export default theme;