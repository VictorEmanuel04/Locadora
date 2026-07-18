import { createTheme } from '@mui/material';

export const themeConfig = {
  background: '#062333',    // Fundo: Branco Gelo
  surface: '#FFFFFF',       // Superfície dos cards (Branco puro para destacar do fundo)
  primary: '#E6A15C',       // Destaques (Botões): Âmbar
  secondary: '#3A6B88',     // Usando a cor de detalhes para elementos secundários
  textPrimary: '#FFFFFF',   // Textos e Ícones: Cinza Carvão
  textPrimary2: '#FFFFFF',  // Mantido igual ao texto principal para manter a legibilidade
  textSecondary: '#e9e8e8', // Detalhes (Links): Azul Petróleo
  warning: '#FF9800',       
  success: '#4CAF50',       
  navbar: '#FFFFFF'         
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