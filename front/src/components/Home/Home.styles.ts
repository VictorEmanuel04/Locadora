import { styled } from 'styled-components';
import { Typography, Button } from '@mui/material';
import { themeConfig } from '../../styles/theme'; 

export const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #1E293B 0%, #0F172A 100%);
  border-radius: 0px;
  border: 3px solid #E6A15C;
  border-top: none;
  border-bottom: none;
  padding-bottom: 60px;
  padding-top: 20px;
`;

export const HeroSection = styled.div`
  margin: 40px 5%;
  padding: 60px 40px;
  
  /* Cor de fundo diferente do fundo geral da página para dar destaque */
  background: linear-gradient(135deg, #241a1a 0%, #111118 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeroContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  width: 100%;
  max-width: 1200px;

  /* Empilha o conteúdo em telas menores */
  @media (max-width: 900px) {
    flex-direction: column-reverse;
    text-align: center;
    gap: 40px;
  }
`;

export const HeroText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    align-items: center;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  max-width: 350px;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  object-fit: cover;
`;

export const HeroTitle = styled(Typography)`
  && {
    font-weight: 900;
    font-size: 3.5rem;
    line-height: 1.1;
    margin-bottom: 16px;
    color: ${themeConfig.primary};
  }
`;

export const HeroSynopsis = styled(Typography)`
  && {
    font-size: 1.1rem;
    color: ${themeConfig.primary};
    margin-bottom: 32px;
    display: -webkit-box;
    -webkit-line-clamp: 4; /* Permite até 4 linhas de sinopse agora que temos mais espaço */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

export const PrimaryButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 10px 32px;
    font-size: 1.1rem;
    font-weight: 700;
    color: #00000;
  }
`;

export const SectionContainer = styled.section`
  padding: 40px 5% 0;
`;

export const SectionTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: ${themeConfig.primary};
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
