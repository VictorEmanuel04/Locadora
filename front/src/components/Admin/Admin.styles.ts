import { styled } from 'styled-components';
import { createTheme, Paper, Typography } from '@mui/material';

import { themeConfig } from '../../styles/theme';

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

export const AdminContainer = styled.div`
  padding: 40px 20px;
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(to bottom, #1E293B 0%, #0F172A 100%);
`;

export const HeaderTitle = styled(Typography)`
  && {
    font-weight: 800;
    margin-bottom: 32px;
    letter-spacing: -0.5px;
    color: ${themeConfig.primary}
  }
`;

export const StyledPaper = styled(Paper)`
  && {
    padding: 24px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: ${themeConfig.background};
  }
`;

export const MovieListContainer = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${themeConfig.primary  }
`;

export const MovieItem = styled(Paper)`
  && {
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px;
    background: ${themeConfig.background};
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;
