import styled from 'styled-components';
import { Typography, Button } from '@mui/material';
import { themeConfig } from '../../styles/theme'; // Ajuste o caminho se necessário

export const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: ${themeConfig.background};
  padding-bottom: 60px;
`;

// --- HERO SECTION (Banner Principal) ---
export const HeroSection = styled.div<{ bgimage?: string }>`
  position: relative;
  height: 70vh;
  min-height: 500px;
  background-image: url(${props => props.bgimage || 'https://via.placeholder.com/1200x600?text=Cinerent'});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;

  /* Gradiente para escurecer as bordas e destacar o texto */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(
      to right,
      rgba(13, 13, 18, 1) 0%,
      rgba(13, 13, 18, 0.6) 50%,
      rgba(13, 13, 18, 0) 100%
    ),
    linear-gradient(
      to top,
      rgba(13, 13, 18, 1) 0%,
      rgba(13, 13, 18, 0) 20%
    );
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 0 5%;
  max-width: 800px;
`;

export const HeroTitle = styled(Typography)`
  && {
    font-weight: 900;
    font-size: 3.5rem;
    line-height: 1.1;
    margin-bottom: 16px;
    color: ${themeConfig.textPrimary};
  }
`;

export const HeroSynopsis = styled(Typography)`
  && {
    font-size: 1.1rem;
    color: ${themeConfig.textSecondary};
    margin-bottom: 32px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
`;

export const PrimaryButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 10px 32px;
    font-size: 1.1rem;
    font-weight: 700;
    color: #FFF;
  }
`;

// --- SEÇÕES DE FILMES (Prateleiras) ---
export const SectionContainer = styled.section`
  padding: 40px 5% 0;
`;

export const SectionTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: ${themeConfig.textPrimary};
  }
`;

export const MovieRow = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
  
  /* Esconde a barra de rolagem em navegadores webkit mas mantém a funcionalidade */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const MoviePoster = styled.div<{ bgimage?: string }>`
  min-width: 200px;
  height: 300px;
  background-image: url(${props => props.bgimage || 'https://via.placeholder.com/200x300?text=Poster'});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.6);
    border-color: ${themeConfig.primary};
  }
`;