import { styled } from 'styled-components';
import { Paper, Typography } from '@mui/material';
import { themeConfig } from '../../styles/theme'; 

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${themeConfig.background};
  padding-bottom: 80px;
`;

export const Backdrop = styled.div<{ bgimage?: string }>`
  height: 50vh;
  min-height: 400px;
  background-image: url(${props => props.bgimage || 'https://via.placeholder.com/1200x500?text=Cinerent'});
  background-size: cover;
  background-position: center 20%;
  position: relative;

  /* Gradiente para fundir o banner com o fundo da página */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to top, ${themeConfig.background} 0%, rgba(13, 13, 18, 0.4) 100%);
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: -150px auto 0; /* Puxa o conteúdo para cima do Backdrop */
  padding: 0 24px;
  position: relative;
  z-index: 2;
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
`;

export const PosterImage = styled.div<{ bgimage?: string }>`
  width: 300px;
  height: 450px;
  background-image: url(${props => props.bgimage || 'https://via.placeholder.com/300x450?text=Poster'});
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

export const InfoSection = styled.div`
  flex: 1;
  min-width: 300px;
  padding-top: 24px;
`;

export const MovieTitle = styled(Typography)`
  && {
    font-weight: 900;
    font-size: 3rem;
    line-height: 1.1;
    margin-bottom: 8px;
    color: ${themeConfig.textPrimary};
  }
`;

export const MetaData = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  color: ${themeConfig.textSecondary};
  font-weight: 500;
`;

export const SectionHeading = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 1.5rem;
    margin: 48px 0 24px;
    color: ${themeConfig.textPrimary};
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 8px;
  }
`;

export const ReviewCard = styled(Paper)`
  && {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
`;
