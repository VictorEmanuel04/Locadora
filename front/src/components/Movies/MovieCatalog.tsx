import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, Typography, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';

import { muiTheme } from '../Admin/Admin.styles'; 
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

// Importe a instância do Axios configurada (ajuste o caminho conforme sua estrutura de pastas)
import { api } from '../../services/api';

interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
  imageUrl?: string; 
}

export default function MovieCatalog() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Função que chama o Controller: listMovies usando Axios
  const fetchMoviesCatalog = useCallback(async (searchQuery: string = '') => {
    setLoading(true);
    try {
      // Como o Axios já tem o baseURL definido com '/api', usamos apenas a rota específica
      const url = searchQuery 
        ? `/movies?search=${encodeURIComponent(searchQuery)}`
        : '/movies';

      const response = await api.get(url);
      
      // O Axios coloca a resposta do servidor na propriedade '.data'
      // Como o seu controller retorna { data: movies }, acessamos '.data.data'
      setMovies(response.data.data);
      
    } catch (error: any) {
      // Tratamento de erro específico do Axios
      console.error(
        "Erro ao buscar filmes:", 
        error.response?.data?.error || error.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os filmes ao carregar a página
  useEffect(() => {
    fetchMoviesCatalog();
  }, [fetchMoviesCatalog]);

  // Implementação de um "debounce" simples
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMoviesCatalog(searchTerm);
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchMoviesCatalog]);

  // Chamaria o Controller: getMovieById 
  const handleMovieClick = async (id: string) => {
    console.log(`Buscando detalhes do filme ${id}...`);
    // Exemplo com Axios:
    // try {
    //   const response = await api.get(`/movies/${id}`);
    //   console.log(response.data.data);
    // } catch (error) { ... }
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