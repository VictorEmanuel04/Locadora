import { useState, useEffect, useContext, useCallback, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  Rating, 
  TextField,
  Alert,
  Avatar
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { muiTheme } from '../../styles/theme'; 
import { api, getApiError } from '../../services/api';
import { AuthContext } from '../../context/authContext';

import { 
  PageContainer, 
  Backdrop, 
  ContentWrapper, 
  PosterImage, 
  InfoSection, 
  MovieTitle, 
  MetaData, 
  SectionHeading,
  ReviewCard
} from './MovieDetails.styles';

// Tipagem com base no Prisma
interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

interface MovieDetailsData {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  releaseYear: number;
  rentalPrice: string | number;
  posterUrl?: string;
  reviews: Review[];
}

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [movie, setMovie] = useState<MovieDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Estados para o formulário de avaliação
  const [myRating, setMyRating] = useState<number | null>(0);
  const [myComment, setMyComment] = useState('');

  const fetchMovie = useCallback(async () => {
    try {
      const response = await api.get(`/movies/${id}`);
      setMovie(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar filme:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate('/auth');
    try {
      await api.post('/cart', { movieId: id });
      setMessage({ text: 'Filme adicionado ao carrinho!', type: 'success' });
    } catch (error: unknown) {
      setMessage({ text: getApiError(error, 'Erro ao adicionar ao carrinho.'), type: 'error' });
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) return navigate('/auth');
    try {
      await api.post('/wishlist', { movieId: id });
      setMessage({ text: 'Adicionado à sua Lista de Desejos!', type: 'success' });
    } catch (error: unknown) {
      setMessage({ text: getApiError(error, 'Erro ao adicionar à wishlist.'), type: 'error' });
    }
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/auth');
    
    try {
      await api.post('/reviews', { movieId: id, rating: myRating, comment: myComment });
      setMessage({ text: 'Avaliação enviada com sucesso!', type: 'success' });
      setMyComment('');
      setMyRating(0);
      fetchMovie(); // Recarrega os dados para mostrar a nova avaliação
    } catch (error: unknown) {
      setMessage({ text: getApiError(error, 'Erro ao enviar avaliação.'), type: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0D0D12' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!movie) return <Typography color="white">Filme não encontrado.</Typography>;

  // Cálculo rápido da média das notas (caso não venha do backend)
  const avgRating = movie.reviews.length > 0 
    ? (movie.reviews.reduce((acc, curr) => acc + curr.rating, 0) / movie.reviews.length).toFixed(1)
    : 'Sem notas';

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <PageContainer>
        <Backdrop bgimage={movie.posterUrl} />
        
        <ContentWrapper>
          <PosterImage bgimage={movie.posterUrl} />
          
          <InfoSection>
            <MovieTitle>{movie.title}</MovieTitle>
            
            <MetaData>
              <span>{movie.releaseYear}</span>
              <span>•</span>
              <span>{movie.genre}</span>
              <span>•</span>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#FFD700' }}>
                <Rating value={Number(avgRating)} readOnly precision={0.5} size="small" sx={{ color: '#FFD700' }} />
                <span>({avgRating})</span>
              </Box>
            </MetaData>

            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 4, lineHeight: 1.6 }}>
              {movie.synopsis}
            </Typography>

            {message && (
              <Alert severity={message.type} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{ px: 4, py: 1.5, borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Alugar por R$ {Number(movie.rentalPrice).toFixed(2).replace('.', ',')}
              </Button>
              
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                startIcon={<FavoriteBorderIcon />}
                onClick={handleAddToWishlist}
                sx={{ px: 3, py: 1.5, borderRadius: '8px', color: '#FFF', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Lista de Desejos
              </Button>
            </Box>
          </InfoSection>
        </ContentWrapper>

        {/* SEÇÃO DE AVALIAÇÕES */}
        <ContentWrapper style={{ marginTop: '24px', display: 'block' }}>
          <SectionHeading>Avaliações dos Usuários</SectionHeading>

          {/* Formulário para adicionar nova avaliação */}
          {isAuthenticated ? (
            <ReviewCard elevation={0} sx={{ mb: 4, borderLeft: '4px solid #635BFF' }}>
              <Typography variant="subtitle1" sx = {{fontWeight:"bold", mb:2}}>Deixe sua opinião</Typography>
              <form onSubmit={handleReviewSubmit}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography component="legend" color="text.secondary">Sua Nota:</Typography>
                  <Rating 
                    value={myRating} 
                    onChange={(_, newValue) => setMyRating(newValue)} 
                    size="large" 
                    sx={{ color: '#FFD700' }}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Escreva sua resenha sobre o filme..."
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary" disabled={!myRating}>
                  Publicar Avaliação
                </Button>
              </form>
            </ReviewCard>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Faça login para deixar sua avaliação.
            </Typography>
          )}

          {/* Lista de Avaliações */}
          {movie.reviews.length === 0 ? (
            <Typography color="text.secondary">Nenhuma avaliação ainda. Seja o primeiro!</Typography>
          ) : (
            movie.reviews.map(review => (
              <ReviewCard key={review.id} elevation={0}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    {review.user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx = {{fontWeight:"bold"}}>{review.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" sx={{ ml: 'auto', color: '#FFD700' }} />
                </Box>
                {review.comment && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    "{review.comment}"
                  </Typography>
                )}
              </ReviewCard>
            ))
          )}
        </ContentWrapper>
      </PageContainer>
    </MuiThemeProvider>
  );
}
