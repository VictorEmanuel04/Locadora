import { createTheme } from '@mui/material';

export const themeConfig = {
  background: '#0D0D12',
  surface: '#1A1A24',
  primary: '#635BFF', 
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
  warning: '#FF9800',
  success: '#4CAF50'
};

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: themeConfig.background, paper: themeConfig.surface },
    primary: { main: themeConfig.primary },
    text: { primary: themeConfig.textPrimary, secondary: themeConfig.textSecondary },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});