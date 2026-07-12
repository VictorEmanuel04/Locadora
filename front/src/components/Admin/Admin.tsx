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

// Importando os estilos e o tema do nosso novo arquivo
import { 
  muiTheme, 
  AdminContainer, 
  HeaderTitle, 
  StyledPaper, 
  MovieListContainer, 
  MovieItem 
} from './Admin.styles';

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

  const fetchMovies = async () => {
    // const response = await fetch('/api/movies');
    // const data = await response.json();
    // setMovies(data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await fetch(`/api/movies/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(`/api/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    
    setFormData({});
    setEditingId(null);
    fetchMovies();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/movies/${id}`, { method: 'DELETE' });
    fetchMovies();
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
          
          <MovieItem elevation={0}>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Estelar: Além do Horizonte</Typography>
              <Typography variant="body2" color="textSecondary">Ano: 2024 • Nota: 4.5</Typography>
            </div>
            <div>
              <IconButton color="primary" onClick={() => console.log('Editar')}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => console.log('Deletar')}>
                <DeleteIcon />
              </IconButton>
            </div>
          </MovieItem>
        </MovieListContainer>

      </AdminContainer>
    </MuiThemeProvider>
  );
}