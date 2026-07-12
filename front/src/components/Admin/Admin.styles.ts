import styled from 'styled-components';
import { createTheme, Paper, Typography } from '@mui/material';

// --- TEMAS GLOBAIS ---
export const themeConfig = {
  background: '#0D0D12',
  surface: '#1A1A24',
  primary: '#635BFF', 
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
};

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: themeConfig.background,
      paper: themeConfig.surface,
    },
    primary: {
      main: themeConfig.primary,
    },
    text: {
      primary: themeConfig.textPrimary,
      secondary: themeConfig.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// --- COMPONENTES VISUAIS (STYLED COMPONENTS) ---
export const AdminContainer = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

export const HeaderTitle = styled(Typography)`
  && {
    font-weight: 800;
    margin-bottom: 32px;
    letter-spacing: -0.5px;
  }
`;

export const StyledPaper = styled(Paper)`
  && {
    padding: 24px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: ${themeConfig.surface};
  }
`;

export const MovieListContainer = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MovieItem = styled(Paper)`
  && {
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;