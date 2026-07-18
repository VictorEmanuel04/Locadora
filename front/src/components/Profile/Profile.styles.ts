import { styled } from 'styled-components';
import { Typography, Paper, Chip } from '@mui/material';
import { themeConfig } from '../../styles/theme';

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${themeConfig.background};
  padding: 80px 5%;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled(Typography)`
  && {
    font-weight: 800;
    font-size: 2rem;
    color: ${themeConfig.textPrimary};
  }
`;

export const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 32px;
  margin-top: 32px;
`;

export const MovieCard = styled(Paper)`
  && {
    background: transparent;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-8px);
    }
  }
`;

export const PosterWrap = styled.div<{ bgimage?: string }>`
  height: 330px;
  background-image: url(${props => props.bgimage || 'https://via.placeholder.com/220x330'});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
`;

export const StatusBadge = styled(Chip)<{ status: 'ACTIVE' | 'EXPIRED' }>`
  && {
    position: absolute;
    top: 12px;
    right: 12px;
    font-weight: bold;
    background-color: ${props => props.status === 'ACTIVE' ? '#4CAF50' : '#F44336'};
    color: white;
  }
`;
