import { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = { 
  palette: {
    mode: 'light',
    primary: {
      main: "#009688"
    },
    secondary: {
      main: "#d4d4d4"
    }
  },
  typography: {
    fontFamily: 'Roboto',
    h1: {
      fontWeight: '900',
      letterSpacing: 9,
      fontSize: 28
    },
    h2: {
      fontWeight: '500',
      fontSize: 32,
      textAlign: 'left'
    },
    h3: {
      color: '#000',
      fontSize: '1rem',
      fontWeight: '700',
      textAlign: 'left'
    },
    h6: {
      fontWeight: '300',
      fontSize: 14,
      textAlign: 'left',
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    body1: {
      fontSize: 14,
      lineHeight: 1.5,
      textAlign: 'left'
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // Some CSS
          fontWeight: 300,
          fontSize: 14,
          textTransform: 'uppercase',
        },
      },
    },
  },
};

export default themeOptions;