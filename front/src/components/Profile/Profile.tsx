import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  Typography, 
  Box, 
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Button
} from '@mui/material';
import { PlayCircle as PlayCircleOutlineIcon, Replay as ReplayIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { muiTheme } from '../../styles/theme'; 
import { api } from '../../services/api';
import { AuthContext } from '../../context/authContext';

import { 
  PageContainer, 
  ProfileHeader, 
  UserInfo, 
  UserName, 
  MoviesGrid, 
  MovieCard, 
  PosterWrap, 
  StatusBadge 
} from './Profile.styles';

// Tipagens
interface Rental {
  id: string;
  movieId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELED';
  expiresAt: string;
  movie: { id: string; title: string; posterUrl: string };
}

interface WishlistItem {
  id: string;
  movieId: string;
  movie: { id: string; title: string; posterUrl: string; rentalPrice: number };
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [currentTab, setCurrentTab] = useState(0);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [rentalsRes, wishlistRes] = await Promise.all([
          api.get('/rentals'), // Supondo que você tem essa rota no rentalController
          api.get('/wishlist')
        ]);
        
        const rentalData = rentalsRes.data.data;
        setRentals([...(rentalData?.active ?? []), ...(rentalData?.expired ?? [])]);
        setWishlist(wishlistRes.data.data || []);
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleRemoveFromWishlist = async (e: React.MouseEvent, movieId: string) => {
    e.stopPropagation(); // Evita clicar no card e ir para a página do filme
    try {
      await api.delete(`/wishlist/${movieId}`);
      setWishlist(prev => prev.filter(item => item.movieId !== movieId));
    } catch (error) {
      console.error("Erro ao remover da wishlist", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0D0D12' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <PageContainer>
        
        <ProfileHeader>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <Typography color="text.secondary">{user?.email}</Typography>
          </UserInfo>
        </ProfileHeader>

        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
          <Tabs value={currentTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
            <Tab label="Meus Aluguéis" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }} />
            <Tab label="Lista de Desejos" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }} />
          </Tabs>
        </Box>

        {/* ABA 0: MEUS ALUGUÉIS */}
        {currentTab === 0 && (
          <Box sx={{ pt: 4 }}>
            {rentals.length === 0 ? (
              <Typography color="text.secondary">Você ainda não alugou nenhum filme.</Typography>
            ) : (
              <MoviesGrid>
                {rentals.map(rental => (
                  <MovieCard key={rental.id} elevation={0} onClick={() => navigate(`/filme/${rental.movie.id}`)}>
                    <PosterWrap bgimage={rental.movie.posterUrl} />
                    <StatusBadge 
                      label={rental.status === 'ACTIVE' ? 'Disponível' : 'Expirado'} 
                      status={rental.status as 'ACTIVE' | 'EXPIRED'} 
                      size="small"
                    />
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx = {{fontWeight:"bold"}} color="text.primary" noWrap>
                        {rental.movie.title}
                      </Typography>
                      {rental.status === 'ACTIVE' ? (
                        <Button startIcon={<PlayCircleOutlineIcon />} color="primary" sx={{ mt: 1, p: 0 }}>
                          Assistir Agora
                        </Button>
                      ) : (
                        <Button startIcon={<ReplayIcon />} color="inherit" sx={{ mt: 1, p: 0, color: 'text.secondary' }}>
                          Alugar Novamente
                        </Button>
                      )}
                    </Box>
                  </MovieCard>
                ))}
              </MoviesGrid>
            )}
          </Box>
        )}

        {/* ABA 1: LISTA DE DESEJOS */}
        {currentTab === 1 && (
          <Box sx={{ pt: 4 }}>
            {wishlist.length === 0 ? (
              <Typography color="text.secondary">Sua lista de desejos está vazia.</Typography>
            ) : (
              <MoviesGrid>
                {wishlist.map(item => (
                  <MovieCard key={item.id} elevation={0} onClick={() => navigate(`/filme/${item.movie.id}`)}>
                    <PosterWrap bgimage={item.movie.posterUrl} />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle1" sx = {{fontWeight:"bold"}} color="text.primary" noWrap>
                          {item.movie.title}
                        </Typography>
                        <Typography variant="body2" color="primary.main" sx = {{fontWeight:"bold"}}>
                          R$ {Number(item.movie.rentalPrice).toFixed(2).replace('.', ',')}
                        </Typography>
                      </Box>
                      <Button 
                        color="error" 
                        size="small" 
                        sx={{ minWidth: 'auto', p: 1 }}
                        onClick={(e) => handleRemoveFromWishlist(e, item.movieId)}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Box>
                  </MovieCard>
                ))}
              </MoviesGrid>
            )}
          </Box>
        )}

      </PageContainer>
    </MuiThemeProvider>
  );
}
