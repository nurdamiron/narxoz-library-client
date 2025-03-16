import { createTheme } from '@mui/material/styles';

/**
 * Университеттің түс схемасы
 * Негізгі түс: Қызыл (#d50032) - университеттің бренд түсі
 * Қосымша түс: Ашық қызыл (#ff5252) - әсерлі акценттер үшін
 * Бұл түстер университеттің корпоративтік стилін сақтай отырып, 
 * заманауи және әсерлі интерфейс жасауға мүмкіндік береді.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#d50032', // Қызыл - университеттің негізгі түсі
      light: '#ff5c5d',
      dark: '#9b0000',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff5252', // Ашық қызыл - қосымша түс
      light: '#ff867f',
      dark: '#c50e29',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
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
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
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
  },
});

export default theme;