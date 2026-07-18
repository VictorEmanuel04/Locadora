import { styled } from 'styled-components';
import { Paper, Typography } from '@mui/material';
import { themeConfig } from '../../styles/theme';

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(to bottom, #1E293B 0%, #0F172A 100%);
`;

export const AuthCard = styled(Paper)`
  && {
    padding: 48px 40px;
    border-radius: 16px;
    width: 100%;
    max-width: 440px;
    background: ${themeConfig.background};
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
  }
`;

export const BrandTitle = styled(Typography)`
  && {
    font-weight: 800;
    letter-spacing: 1px;
    text-align: center;
    margin-bottom: 8px;
    color: ${themeConfig.primary};
  }
`;

export const SubTitle = styled(Typography)`
  && {
    text-align: center;
    margin-bottom: 32px;
    color: ${themeConfig.textSecondary};
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ToggleText = styled(Typography)`
  && {
    text-align: center;
    margin-top: 24px;
    font-size: 0.875rem;
    color: ${themeConfig.textSecondary};

    span {
      color: ${themeConfig.primary};
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.8;
        text-decoration: underline;
      }
    }
  }
`;
