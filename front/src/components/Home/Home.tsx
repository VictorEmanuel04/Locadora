import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline, Button, CircularProgress, Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { muiTheme } from '../../styles/theme'; 
import { api } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

import { 
  HomeContainer, 
  HeroSection, 
  HeroContent, 
  HeroTitle, 
  HeroSynopsis, 
  ActionButtons, 
  PrimaryButton,
  SectionContainer,
  SectionTitle,
  MovieRow,
  MoviePoster
} from './Home.styles';

// Tipagem baseada no backend
interface Movie {
  id: string;
  title: string;
  synopsis: string;
  posterUrl?: string;
  genre: string;
}

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [recommendationReason, setRecommendationReason] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // 1. Busca os últimos lançamentos (Rota pública, limitando a 10 filmes)
        const latestRes = await api.get('/movies?limit=10');
        const moviesList = latestRes.data.data;
        setLatestMovies(moviesList);

        // Define o primeiro filme da lista como destaque no Hero Banner
        if (moviesList.length > 0) {
          setFeaturedMovie(moviesList[0]);
        }

        // 2. Busca recomendações APENAS se o usuário estiver logado
        if (isAuthenticated) {
          const recRes = await api.get('/recommendations');
          setRecommendedMovies(recRes.data.data);
          setRecommendationReason(recRes.data.reason);
        }

      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [isAuthenticated]);

  const handleMovieClick = (id: string) => {
    navigate(`/filme/${id}`); // Redireciona para a página de detalhes que criaremos depois
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
      <HomeContainer>
        
        {/* HERO BANNER EM DESTAQUE */}
        {featuredMovie && (
          <HeroSection bgimage={featuredMovie.posterUrl}>
            <HeroContent>
              <HeroTitle variant="h1">{featuredMovie.title}</HeroTitle>
              <HeroSynopsis variant="body1">
                {featuredMovie.synopsis}
              </HeroSynopsis>
              
              <ActionButtons>
                <PrimaryButton 
                  variant="contained" 
                  color="primary" 
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleMovieClick(featuredMovie.id)}
                >
                  Alugar Agora
                </PrimaryButton>
                
                <Button 
                  variant="outlined" 
                  sx={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.5)', borderRadius: '8px', px: 3, fontWeight: 'bold' }}
                  startIcon={<InfoOutlinedIcon />}
                  onClick={() => handleMovieClick(featuredMovie.id)}
                >
                  Mais Informações
                </Button>
              </ActionButtons>
            </HeroContent>
          </HeroSection>
        )}

        {/* PRATELEIRA 1: RECOMENDAÇÕES (Só aparece para logados) */}
        {isAuthenticated && recommendedMovies.length > 0 && (
          <SectionContainer>
            <SectionTitle>Recomendados para Você</SectionTitle>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2, mt: -1.5 }}>
              {recommendationReason}
            </Typography>
            
            <MovieRow>
              {recommendedMovies.map(movie => (
                <MoviePoster 
                  key={`rec-${movie.id}`} 
                  bgimage={movie.posterUrl}
                  onClick={() => handleMovieClick(movie.id)}
                  title={movie.title} // Tooltip nativo ao passar o mouse
                />
              ))}
            </MovieRow>
          </SectionContainer>
        )}

        {/* PRATELEIRA 2: LANÇAMENTOS / ADICIONADOS RECENTEMENTE */}
        <SectionContainer>
          <SectionTitle>Adicionados Recentemente</SectionTitle>
          <MovieRow>
            {latestMovies.map(movie => (
              <MoviePoster 
                key={`latest-${movie.id}`} 
                bgimage={movie.posterUrl}
                onClick={() => handleMovieClick(movie.id)}
                title={movie.title}
              />
            ))}
          </MovieRow>
        </SectionContainer>

      </HomeContainer>
    </MuiThemeProvider>
  );
}