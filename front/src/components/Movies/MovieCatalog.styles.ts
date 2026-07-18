import { styled } from 'styled-components';
import { Paper, Typography, InputBase } from '@mui/material';

import { themeConfig } from '../../styles/theme'; 

export const CatalogContainer = styled.div`
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
`;

export const SectionTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 1.5rem;
    color: ${themeConfig.textPrimary};
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  padding: 4px 16px;
  width: 100%;
  min-width: 250px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s;

  &:focus-within {
    border-color: ${themeConfig.primary};
  }
`;

export const StyledInputBase = styled(InputBase)`
  && {
    color: ${themeConfig.textPrimary};
    width: 100%;
    margin-left: 8px;
    font-size: 0.95rem;
  }
`;

export const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
`;

export const MovieCard = styled(Paper)`
  && {
    background: transparent;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
    }
  }
`;

export const MovieCover = styled.div<{ imageUrl?: string }>`
  width: 100%;
  aspect-ratio: 2 / 3;
  background-color: ${themeConfig.surface};
  background-image: url(${props => props.imageUrl || 'https://via.placeholder.com/220x330'});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 12px;
`;

export const MovieInfo = styled.div`
  padding: 0 4px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;
