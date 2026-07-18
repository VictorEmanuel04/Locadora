import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { themeConfig } from '../../styles/theme'; 
import { 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  Typography, 
  Box,
  MenuItem,
  Select,
  FormControl,
  Pagination
} from '@mui/material';
import { Search as SearchIcon, Star as StarIcon } from '@mui/icons-material';

import { muiTheme } from '../Admin/Admin.styles'; 
import { 
  CatalogContainer, 
  TopBar, 
  SectionTitle, 
  FilterContainer,
  SearchContainer, 
  StyledInputBase, 
  MovieGrid, 
  MovieCard, 
  MovieCover, 
  MovieInfo,
  PaginationContainer,
} from './MovieCatalog.styles';

import { api, getApiError } from '../../services/api';

// Atualizado para englobar as propriedades que o backend retorna agora
interface Movie {
  id: string;
  title: string;
  description: string;
  year?: number;
  releaseYear?: number;
  rating?: number;
  imageUrl?: string; 
  posterUrl?: string;
}

const GENRES = ['Todos', 'Ação', 'Comédia', 'Drama', 'Ficção Científica', 'Terror', 'Romance', 'Aventura', 'Fantasia'];

export default function MovieCatalog() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Novos estados para Filtros e Paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('Todos');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // A função agora recebe página e gênero além da busca
  const fetchMoviesCatalog = useCallback(async (searchQuery: string, currentPage: number, currentGenre: string) => {
    setLoading(true);
    try {
      // Monta a URL base com paginação
      let url = `/movies?page=${currentPage}&limit=10&available=true`;
      
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (currentGenre !== 'Todos') url += `&genre=${currentGenre}`;

      const response = await api.get(url);
      
      // Atualiza os dados
      setMovies(response.data.data);
      
      // Atualiza os metadados da paginação
      if (response.data.meta) {
        setTotalPages(response.data.meta.totalPages);
      }
      
    } catch (error: unknown) {
      console.error("Erro ao buscar filmes:", getApiError(error, "Erro ao buscar filmes."));
    } finally {
      setLoading(false);
    }
  }, []);

  // O "debounce" modificado: Ouve as mudanças de termo, gênero e página
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMoviesCatalog(searchTerm, page, genre);
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page, genre, fetchMoviesCatalog]);

  // Funções de manipulação de eventos
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenreChange = (event: { target: { value: string } }) => {
    setGenre(event.target.value);
    setPage(1); // Se o usuário mudar o filtro, volta para a página 1 automaticamente
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Volta para a página 1 ao digitar nova busca
  };

  const handleMovieClick = (id: string) => {
    // Agora navega de verdade para a página de detalhes!
    navigate(`/filme/${id}`);
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <CatalogContainer>
        
        <TopBar>
          <SectionTitle>Catálogo Completo</SectionTitle>
          
          <FilterContainer>
            <SearchContainer>
              <SearchIcon sx={{ color: themeConfig.textSecondary }} />
              <StyledInputBase
                placeholder="Buscar filmes..."
                value={searchTerm}
                onChange={handleSearchChange}
                inputProps={{ 'aria-label': 'search' }}
              />
            </SearchContainer>

            {/* Novo seletor de Gênero */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={genre}
                onChange={handleGenreChange}
                displayEmpty
                sx={{ 
                  color: 'white', 
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: themeConfig.primary },
                  '.MuiSvgIcon-root': { color: 'white' }
                }}
              >
                {GENRES.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </FilterContainer>
        </TopBar>

        {loading ? (
          <Typography color="textSecondary">Carregando catálogo...</Typography>
        ) : movies.length === 0 ? (
          <Typography color="textSecondary">Nenhum filme encontrado.</Typography>
        ) : (
          <>
            <MovieGrid>
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  elevation={0}
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <MovieCover imageUrl={movie.posterUrl || movie.imageUrl} />
                  
                  <MovieInfo>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2, mb: 0.5 }} noWrap>
                      {movie.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="textSecondary">
                        {movie.releaseYear || movie.year || 'N/A'}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#FFD700', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {movie.rating || '5.0'}
                        </Typography>
                      </Box>
                    </Box>
                  </MovieInfo>
                </MovieCard>
              ))}
            </MovieGrid>

            {/* Componente de Paginação adicionado */}
            {totalPages > 1 && (
              <PaginationContainer>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': { color: '#FFF' },
                    '& .Mui-selected': { fontWeight: 'bold' }
                  }}
                />
              </PaginationContainer>
            )}
          </>
        )}

      </CatalogContainer>
    </MuiThemeProvider>
  );
}
