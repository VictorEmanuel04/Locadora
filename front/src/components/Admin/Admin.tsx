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
import { api } from '../../services/api';

// --- TIPAGENS ---
interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
}

// --- COMPONENTE PRINCIPAL ---
export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formData, setFormData] = useState<Partial<Movie>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Busca os filmes com Axios
  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies');
      setMovies(response.data.data);
    } catch (error: any) {
      console.error("Erro ao carregar filmes:", error.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    // Converte ano e nota para Number para evitar erros de tipagem no Prisma (backend)
    const payload = {
      ...formData,
      year: formData.year ? Number(formData.year) : undefined,
      rating: formData.rating ? Number(formData.rating) : undefined,
    };
    
    try {
      if (editingId) {
        // Rota de PUT (Update)
        await api.put(`/movies/${editingId}`, payload);
      } else {
        // Rota de POST (Create)
        await api.post('/movies', payload);
      }
      
      // Limpa os campos e recarrega a lista
      setFormData({});
      setEditingId(null);
      fetchMovies();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.error || "Erro ao salvar o filme.");
    }
  };

  const handleDelete = async (id: string) => {
    // Confirmação simples para evitar exclusão acidental
    if (!window.confirm("Tem certeza que deseja excluir este filme?")) return;

    try {
      // Rota de DELETE
      await api.delete(`/movies/${id}`);
      fetchMovies(); // Recarrega a lista
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      alert(error.response?.data?.error || "Erro ao excluir o filme.");
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingId(movie.id);
    setFormData(movie);
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
              <Grid item xs={12} sm={8}>
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
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Ano"
                  name="year"
                  type="number"
                  value={formData.year || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Nota (Ex: 4.5)"
                  name="rating"
                  type="number"
                  inputProps={{ step: 0.1 }}
                  value={formData.rating || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sinopse"
                  name="description"
                  multiline
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleInputChange}
                />
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
                  <Typography variant="body2" color="textSecondary">Ano: {movie.year} • Nota: {movie.rating}</Typography>
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