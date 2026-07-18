import styled from 'styled-components';
import { Typography, Button } from '@mui/material';
import { themeConfig } from '../../styles/theme'; // Ajuste o caminho se necessário

export const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: #1e293b;; /* Fundo semi-transparente */
  backdrop-filter: blur(10px); /* Efeito de vidro (glassmorphism) */
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 1000;
  display: flex;
  align-items: center;
`;

export const NavContent = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const BrandName = styled(Typography)`
  && {
    font-weight: 900;
    font-size: 1.8rem;
    color: ${themeConfig.primary};
    letter-spacing: -0.5px;
  }
`;

export const LinksSection = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none; /* Esconde os links no celular para simplificar */
  }
`;

export const NavLink = styled(Typography)<{ active?: boolean }>`
  && {
    font-weight: 600;
    font-size: 1rem;
    color: ${props => props.active ? themeConfig.primary : themeConfig.textSecondary};
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: ${themeConfig.primary};
    }
  }
`;

export const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const LoginButton = styled(Button)`
  && {
    font-weight: bold;
    border-radius: 8px;
    text-transform: none;
    font-size: 1rem;
  }
`;
