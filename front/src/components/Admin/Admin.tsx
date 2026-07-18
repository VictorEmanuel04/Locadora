import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  TextField, 
  Button, 
  Typography, 
  IconButton, 
  Grid 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Importando os estilos e o tema do arquivo .styles
import { 
  muiTheme, 
  AdminContainer, 
  HeaderTitle, 
  StyledPaper, 
  MovieListContainer, 
  MovieItem 
} from './Admin.styles';

// Importando a instância do Axios (Ajuste o caminho conforme sua estrutura)
import { api, getApiError } from '../../services/api';

// --- TIPAGENS ---
interface Movie {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  releaseYear?: number | null;
  rentalPrice: string | number;
  stock: number;
  discountPercentage: number;
}

type MovieForm = Omit<Movie, 'id'>;

// --- COMPONENTE PRINCIPAL ---
export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formData, setFormData] = useState<Partial<MovieForm>>({ stock: 1, discountPercentage: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Busca os filmes com Axios
  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies');
      setMovies(response.data.data);
    } catch (error: unknown) {
      console.error("Erro ao carregar filmes:", getApiError(error, "Erro ao carregar filmes."));
    }
  };

  useEffect(() => {
    // Busca assíncrona de um recurso externo após a primeira renderização.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchMovies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    // Converte ano e nota para Number para evitar erros de tipagem no Prisma (backend)
    const payload = {
      ...formData,
      releaseYear: formData.releaseYear ? Number(formData.releaseYear) : undefined,
      rentalPrice: formData.rentalPrice ? Number(formData.rentalPrice) : undefined,
      stock: formData.stock ? Number(formData.stock) : 1,
      discountPercentage: Number(formData.discountPercentage ?? 0),
    };
    
    try {
      if (editingId) {
        // Rota de PUT (Update)
        await api.put(`/admin/movies/${editingId}`, payload);
      } else {
        // Rota de POST (Create)
        await api.post('/admin/movies', payload);
      }
      
      // Limpa os campos e recarrega a lista
      setFormData({});
      setEditingId(null);
      fetchMovies();
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
      fetchMovies(); // Recarrega a lista
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
            Catálogo Existente
          </Typography>
          
          {/* Mapeamento dinâmico dos filmes do backend */}
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
        </MovieListContainer>

      </AdminContainer>
    </MuiThemeProvider>
  );
}
