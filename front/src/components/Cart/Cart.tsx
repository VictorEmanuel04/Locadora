import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  Button, 
  Typography, 
  Box, 
  CircularProgress,
  IconButton,
  Alert
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { muiTheme } from '../../styles/theme'; 
import { api, getApiError } from '../../services/api';
import { AuthContext } from '../../context/authContext';

import { 
  PageContainer, 
  CartLayout, 
  ItemsSection, 
  PageTitle, 
  CartItemCard, 
  ItemImage, 
  ItemDetails, 
  SummarySection, 
  SummaryRow 
} from './Cart.styles';

interface CartItem {
  id: string;
  movieId: string;
  movie: {
    id: string;
    title: string;
    posterUrl: string;
    rentalPrice: string | number;
  };
}

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCartItems(response.data.data);
    } catch (err: unknown) {
      setError(getApiError(err, 'Erro ao carregar o carrinho.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const handleRemoveItem = async (movieId: string) => {
    try {
      await api.delete(`/cart/${movieId}`);
      // Atualiza a tela removendo o item localmente sem precisar dar reload
      setCartItems(prev => prev.filter(item => item.movieId !== movieId));
    } catch (err: unknown) {
      setError(getApiError(err, 'Erro ao remover item.'));
    }
  };

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      // Assumindo que você tem uma rota para processar o aluguel no seu rentalController
      // Normalmente você mandaria os dados de pagamento aqui se não fosse uma simulação
      await api.post('/rentals/checkout', { 
        movieIds: cartItems.map(item => item.movieId) 
      });

      // Se o backend não limpa o carrinho automaticamente após o aluguel,
      // você precisaria chamar um api.delete('/cart/clear') aqui.

      setSuccess(true);
      setCartItems([]);
      
      // Redireciona para o painel do usuário após alguns segundos
      setTimeout(() => {
        navigate('/perfil'); // Rota do painel que faremos depois
      }, 3000);

    } catch (err: unknown) {
      setError(getApiError(err, 'Ocorreu um erro no pagamento.'));
    } finally {
      setProcessing(false);
    }
  };

  // Cálculo do Total
  const total = cartItems.reduce((acc, item) => acc + Number(item.movie.rentalPrice), 0);

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
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Continuar navegando
        </Button>

        <PageTitle>Meu Carrinho</PageTitle>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 4 }}>Pagamento aprovado! Redirecionando para seus filmes...</Alert>}

        {cartItems.length === 0 && !success ? (
          <Box sx = {{ textAlign:"center", py: 10}}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Seu carrinho está vazio.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mt: 2 }}>
              Explorar Catálogo
            </Button>
          </Box>
        ) : (
          !success && (
            <CartLayout>
              <ItemsSection>
                {cartItems.map(item => (
                  <CartItemCard elevation={0} key={item.id}>
                    <ItemImage bgimage={item.movie.posterUrl} />
                    <ItemDetails>
                      <Typography variant="h6" sx = {{fontWeight:"bold"}} color="text.primary">
                        {item.movie.title}
                      </Typography>
                      <Typography variant="body1" color="primary.main" sx = {{fontWeight:"bold", mt: 1}}>
                        R$ {Number(item.movie.rentalPrice).toFixed(2).replace('.', ',')}
                      </Typography>
                    </ItemDetails>
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveItem(item.movieId)}
                      sx={{ position: 'absolute', top: 16, right: 16 }}
                      title="Remover do carrinho"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </CartItemCard>
                ))}
              </ItemsSection>

              <SummarySection elevation={0}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4 }} color="text.primary">
                  Resumo do Pedido
                </Typography>

                <SummaryRow>
                  <span>Subtotal ({cartItems.length} itens)</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </SummaryRow>

                <SummaryRow>
                  <span>Taxas / Impostos</span>
                  <span>R$ 0,00</span>
                </SummaryRow>

                <SummaryRow className="total">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </SummaryRow>

                {/* Simulação de dados de cartão - Apenas visual para o escopo */}
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Simulação de Pagamento
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon fontSize="small" /> **** **** **** 4242
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large"
                  disabled={processing}
                  onClick={handleCheckout}
                  sx={{ mt: 4, py: 1.5, borderRadius: '8px', fontWeight: 'bold' }}
                >
                  {processing ? 'Processando...' : 'Finalizar Aluguel'}
                </Button>
              </SummarySection>
            </CartLayout>
          )
        )}
      </PageContainer>
    </MuiThemeProvider>
  );
}
