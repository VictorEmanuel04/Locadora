import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, Typography, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';

import { muiTheme } from '../Admin/Admin.styles'; // Reutilizando o tema global
import { 
  CatalogContainer, 
  TopBar, 
  SectionTitle, 
  SearchContainer, 
  StyledInputBase, 
  MovieGrid, 
  MovieCard, 
  MovieCover, 
  MovieInfo,
  themeConfig
} from './MovieCatalog.styles';

interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
  imageUrl?: string; // Assumindo que você terá uma imagem depois
}

export default function MovieCatalog() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Função que chama o Controller: listMovies
  const fetchMoviesCatalog = useCallback(async (searchQuery: string = '') => {
    setLoading(true);
    try {
      // Monta a URL passando o search por query param, caso exista
      const url = searchQuery 
        ? `/api/movies?search=${encodeURIComponent(searchQuery)}`
        : '/api/movies';

      const response = await fetch(url);
      const result = await response.json();
      
      if (response.ok) {
        setMovies(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os filmes ao carregar a página
  useEffect(() => {
    fetchMoviesCatalog();
  }, [fetchMoviesCatalog]);

  // Implementação de um "debounce" simples: busca após o usuário parar de digitar
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMoviesCatalog(searchTerm);
    }, 500); // Aguarda 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchMoviesCatalog]);

  // Chamaria o Controller: getMovieById (Exemplo: abrir modal ou ir para outra página)
  const handleMovieClick = async (id: string) => {
    console.log(`Buscando detalhes do filme ${id}...`);
    // Aqui você faria um fetch(`/api/movies/${id}`)
    // e abriria um modal com as informações detalhadas!
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <CatalogContainer>
        
        <TopBar>
          <SectionTitle>Catálogo Completo</SectionTitle>
          
          <SearchContainer>
            <SearchIcon sx={{ color: themeConfig.textSecondary }} />
            <StyledInputBase
              placeholder="Buscar filmes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchContainer>
        </TopBar>

        {loading ? (
          <Typography color="textSecondary">Carregando catálogo...</Typography>
        ) : movies.length === 0 ? (
          <Typography color="textSecondary">Nenhum filme encontrado para "{searchTerm}".</Typography>
        ) : (
          <MovieGrid>
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                elevation={0}
                onClick={() => handleMovieClick(movie.id)}
              >
                {/* Se não tiver imagem, exibe um fundo genérico configurado no estilo */}
                <MovieCover imageUrl={movie.imageUrl} />
                
                <MovieInfo>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2, mb: 0.5 }} noWrap>
                    {movie.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">
                      {movie.year}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ color: '#FFD700', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {movie.rating}
                      </Typography>
                    </Box>
                  </Box>
                </MovieInfo>
              </MovieCard>
            ))}
          </MovieGrid>
        )}

      </CatalogContainer>
    </MuiThemeProvider>
  );
}