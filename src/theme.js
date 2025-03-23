/**
 * src/theme.js
 * 
 * Material UI тақырыбын орнату
 * 
 * Бұл файл Material UI компоненттерінің сыртқы түрін анықтайды,
 * соның ішінде түстер, қаріптер, көлеңкелер және т.б.
 */
import { createTheme } from '@mui/material/styles';

/**
 * Тақырып палитрасын жасау
 * 
 * Негізгі түс: #d50032 (қызыл) - Нархоз университетінің бренд түсі
 * Қосымша түс: #ff5252 (ашық қызыл) - акценттер үшін
 */
const theme = createTheme({
  palette: {
    primary: {
      light: '#ff355b', // Негізгіден ашығырақ
      main: '#d50032', // Негізгі бренд түсі
      dark: '#9e0025', // Негізгіден қоюырақ
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ff867f',
      main: '#ff5252', // Қосымша түс
      dark: '#c50e29',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f8f8',
      paper: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.06)',
    '0px 3px 3px -2px rgba(0,0,0,0.1),0px 2px 2px 0px rgba(0,0,0,0.07),0px 1px 5px 0px rgba(0,0,0,0.06)',
    '0px 3px 4px -2px rgba(0,0,0,0.1),0px 3px 3px -2px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 4px 5px -2px rgba(0,0,0,0.1),0px 4px 5px -2px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
    '0px 5px 8px -3px rgba(0,0,0,0.1),0px 5px 7px -2px rgba(0,0,0,0.07),0px 2px 16px 1px rgba(0,0,0,0.06)',
    '0px 6px 10px -4px rgba(0,0,0,0.1),0px 6px 10px -2px rgba(0,0,0,0.07),0px 3px 16px 2px rgba(0,0,0,0.06)',
    '0px 7px 10px -4px rgba(0,0,0,0.1),0px 7px 12px -2px rgba(0,0,0,0.07),0px 4px 18px 3px rgba(0,0,0,0.06)',
    '0px 8px 12px -5px rgba(0,0,0,0.1),0px 8px 14px -2px rgba(0,0,0,0.07),0px 5px 22px 4px rgba(0,0,0,0.06)',
    '0px 9px 14px -6px rgba(0,0,0,0.1),0px 9px 16px -2px rgba(0,0,0,0.07),0px 6px 24px 5px rgba(0,0,0,0.06)',
    '0px 10px 16px -7px rgba(0,0,0,0.1),0px 10px 18px -2px rgba(0,0,0,0.07),0px 7px 26px 6px rgba(0,0,0,0.06)',
    '0px 11px 16px -7px rgba(0,0,0,0.1),0px 11px 20px -2px rgba(0,0,0,0.07),0px 8px 28px 7px rgba(0,0,0,0.06)',
    '0px 12px 17px -8px rgba(0,0,0,0.1),0px 12px 22px -2px rgba(0,0,0,0.07),0px 9px 30px 8px rgba(0,0,0,0.06)',
    '0px 13px 18px -9px rgba(0,0,0,0.1),0px 13px 24px -2px rgba(0,0,0,0.07),0px 10px 32px 9px rgba(0,0,0,0.06)',
    '0px 14px 19px -9px rgba(0,0,0,0.1),0px 14px 26px -2px rgba(0,0,0,0.07),0px 11px 34px 10px rgba(0,0,0,0.06)',
    '0px 15px 20px -10px rgba(0,0,0,0.1),0px 15px 28px -2px rgba(0,0,0,0.07),0px 12px 36px 11px rgba(0,0,0,0.06)',
    '0px 16px 22px -10px rgba(0,0,0,0.1),0px 16px 30px -2px rgba(0,0,0,0.07),0px 13px 38px 12px rgba(0,0,0,0.06)',
    '0px 17px 23px -11px rgba(0,0,0,0.1),0px 17px 32px -2px rgba(0,0,0,0.07),0px 14px 40px 13px rgba(0,0,0,0.06)',
    '0px 18px 24px -11px rgba(0,0,0,0.1),0px 18px 34px -2px rgba(0,0,0,0.07),0px 15px 42px 14px rgba(0,0,0,0.06)',
    '0px 19px 25px -12px rgba(0,0,0,0.1),0px 19px 36px -2px rgba(0,0,0,0.07),0px 16px 44px 15px rgba(0,0,0,0.06)',
    '0px 20px 26px -12px rgba(0,0,0,0.1),0px 20px 38px -2px rgba(0,0,0,0.07),0px 17px 46px 16px rgba(0,0,0,0.06)',
    '0px 21px 28px -13px rgba(0,0,0,0.1),0px 21px 40px -2px rgba(0,0,0,0.07),0px 18px 48px 17px rgba(0,0,0,0.06)',
    '0px 22px 29px -13px rgba(0,0,0,0.1),0px 22px 42px -2px rgba(0,0,0,0.07),0px 19px 50px 18px rgba(0,0,0,0.06)',
    '0px 23px 30px -14px rgba(0,0,0,0.1),0px 23px 44px -2px rgba(0,0,0,0.07),0px 20px 52px 19px rgba(0,0,0,0.06)',
    '0px 24px 32px -14px rgba(0,0,0,0.1),0px 24px 46px -2px rgba(0,0,0,0.07),0px 21px 54px 20px rgba(0,0,0,0.06)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          boxShadow: '0px 4px 10px rgba(213, 0, 50, 0.3)',
          '&:hover': {
            boxShadow: '0px 6px 15px rgba(213, 0, 50, 0.4)',
            transform: 'translateY(-2px)',
            backgroundColor: '#bf002d', // Hover кезінде қоюрақ түске өзгереді
          },
          '&:active': {
            boxShadow: '0px 2px 5px rgba(213, 0, 50, 0.3)',
            transform: 'translateY(0)',
          },
        },
        outlinedPrimary: {
          borderColor: '#d50032',
          '&:hover': {
            backgroundColor: 'rgba(213, 0, 50, 0.04)',
          },
        },
        textPrimary: {
          '&:hover': {
            backgroundColor: 'rgba(213, 0, 50, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused fieldset': {
              borderColor: '#d50032',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#d50032',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#d50032',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#d50032',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#d50032',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#d50032',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#d50032',
            '& + .MuiSwitch-track': {
              backgroundColor: '#d50032',
            },
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: '#d50032',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: 'rgba(213, 0, 50, 0.2)',
        },
        barColorPrimary: {
          backgroundColor: '#d50032',
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(213, 0, 50, 0.1)',
            color: '#d50032',
            fontWeight: 500,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #fff',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          color: '#2e7d32',
        },
        standardError: {
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          color: '#d32f2f',
        },
        standardWarning: {
          backgroundColor: 'rgba(237, 108, 2, 0.1)',
          color: '#ed6c02',
        },
        standardInfo: {
          backgroundColor: 'rgba(2, 136, 209, 0.1)',
          color: '#0288d1',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(213, 0, 50, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(213, 0, 50, 0.15)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(213, 0, 50, 0.05)',
          },
        },
      },
    },
  },
});

export default theme;