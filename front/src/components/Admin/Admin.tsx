import React, { useState, useEffect, useCallback } from 'react';
import { 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  TextField, 
  Button, 
  Typography, 
  IconButton, 
  Grid,
  Pagination
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

import { 
  muiTheme, 
  AdminContainer, 
  HeaderTitle, 
  StyledPaper, 
  MovieListContainer, 
  MovieItem 
} from './Admin.styles';

import { api, getApiError } from '../../services/api';

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  releaseYear?: number | null;
  rentalPrice: string | number;
  stock: number;
  discountPercentage: number;
  posterUrl?: string | null;
}

type MovieForm = Omit<Movie, 'id'>;

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formData, setFormData] = useState<Partial<MovieForm>>({ stock: 1, discountPercentage: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchMovies = useCallback(async (currentPage: number) => {
    try {
      const response = await api.get('/movies', {
        params: { page: currentPage, limit: 10 }
      });
      setMovies(response.data.data);
      setTotalPages(Math.max(response.data.meta?.totalPages ?? 1, 1));
      setTotalItems(response.data.meta?.totalItems ?? response.data.data.length);
    } catch (error: unknown) {
      console.error("Erro ao carregar filmes:", getApiError(error, "Erro ao carregar filmes."));
    }
  }, []);

  useEffect(() => {
    // Busca assíncrona de um recurso externo após a montagem.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchMovies(page);
  }, [fetchMovies, page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      releaseYear: formData.releaseYear ? Number(formData.releaseYear) : undefined,
      rentalPrice: formData.rentalPrice ? Number(formData.rentalPrice) : undefined,
      stock: formData.stock ? Number(formData.stock) : 1,
      discountPercentage: Number(formData.discountPercentage ?? 0),
    };
    
    try {
      if (editingId) {
        await api.put(`/admin/movies/${editingId}`, payload);
      } else {
        await api.post('/admin/movies', payload);
      }
      
      setFormData({});
      setEditingId(null);
      await fetchMovies(page);
    } catch (error: unknown) {
      alert(getApiError(error, "Erro ao salvar o filme."));
    }
  };

  const handleDelete = async (id: string) => {
    // Confirmação simples para evitar exclusão acidental
    if (!window.confirm("Tem certeza que deseja excluir este filme?")) return;

    try {
      // Rota de DELETE
      await api.delete(`/admin/movies/${id}`);
      if (movies.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await fetchMovies(page);
      }
    } catch (error: unknown) {
      alert(getApiError(error, "Erro ao excluir o filme."));
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingId(movie.id);
    setFormData({
      title: movie.title,
      synopsis: movie.synopsis,
      genre: movie.genre,
      releaseYear: movie.releaseYear,
      rentalPrice: movie.rentalPrice,
      stock: movie.stock,
      discountPercentage: movie.discountPercentage,
      posterUrl: movie.posterUrl,
    });
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline /> 
      <AdminContainer>
        <HeaderTitle variant="h3" color="textPrimary">
          Painel de Controle CINERENT
        </HeaderTitle>

        <StyledPaper elevation={0}>
          <Typography variant="h6" gutterBottom color="primary">
            {editingId ? 'Editar Filme' : 'Adicionar Novo Filme'}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Título do Filme"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Ano de lançamento"
                  name="releaseYear"
                  type="number"
                  value={formData.releaseYear || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Preço da locação"
                  name="rentalPrice"
                  type="number"
                  inputProps={{ step: "0.01", min: 0 }}
                  value={formData.rentalPrice || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sinopse"
                  name="synopsis"
                  multiline
                  rows={3}
                  value={formData.synopsis || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL do Pôster/Capa (Link da imagem)"
                  name="posterUrl"
                  value={formData.posterUrl || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Gênero" name="genre" value={formData.genre || ''} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Estoque" name="stock" type="number" inputProps={{ min: 0 }} value={formData.stock ?? 1} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Desconto (%)" name="discountPercentage" type="number" inputProps={{ min: 0, max: 100 }} value={formData.discountPercentage ?? 0} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  sx={{ borderRadius: '8px', px: 4 }}
                >
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Filme'}
                </Button>
                {editingId && (
                  <Button 
                    onClick={() => { setEditingId(null); setFormData({}); }}
                    sx={{ ml: 2, color: 'text.secondary' }}
                  >
                    Cancelar
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </StyledPaper>

        <MovieListContainer>
          <Typography variant="h5" color="textPrimary" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            Catálogo Existente ({totalItems})
          </Typography>
          
          {movies.length === 0 ? (
            <Typography color="textSecondary">Nenhum filme cadastrado ainda.</Typography>
          ) : (
            movies.map((movie) => (
              <MovieItem elevation={0} key={movie.id}>
                <div>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{movie.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{movie.genre} • {movie.releaseYear ?? 'Ano não informado'} • R$ {Number(movie.rentalPrice).toFixed(2)}</Typography>
                </div>
                <div>
                  <IconButton color="primary" onClick={() => handleEdit(movie)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(movie.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </MovieItem>
            ))
          )}

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_event, nextPage) => setPage(nextPage)}
              color="primary"
              size="large"
              sx={{
                alignSelf: 'center',
                mt: 2,
                '& .MuiPaginationItem-root': { color: 'text.primary' }
              }}
            />
          )}
        </MovieListContainer>

      </AdminContainer>
    </MuiThemeProvider>
  );
}
