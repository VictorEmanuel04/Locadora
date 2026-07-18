import styled from 'styled-components';
import { Paper, Typography } from '@mui/material';
import { themeConfig } from '../../styles/theme';

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${themeConfig.background};
  padding: 80px 5%;
`;

export const CartLayout = styled.div`
  display: flex;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const ItemsSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PageTitle = styled(Typography)`
  && {
    font-weight: 800;
    font-size: 2rem;
    color: ${themeConfig.textPrimary};
    margin-bottom: 24px;
  }
`;

export const CartItemCard = styled(Paper)`
  && {
    display: flex;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 16px;
    gap: 20px;
    position: relative;
  }
`;

export const ItemImage = styled.div<{ bgimage?: string }>`
  width: 100px;
  height: 150px;
  background-image: url(${props => props.bgimage || 'https://via.placeholder.com/100x150'});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  flex-shrink: 0;
`;

export const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

export const SummarySection = styled(Paper)`
  && {
    flex: 1;
    min-width: 300px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
    position: sticky;
    top: 100px;
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: ${themeConfig.textSecondary};
  font-size: 1.1rem;

  &.total {
    color: ${themeConfig.primary};
    font-weight: 800;
    font-size: 1.5rem;
    margin-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
  }
`;