import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  TextField, 
  Button, 
  Alert
} from '@mui/material';

import { muiTheme } from '../Admin/Admin.styles'; 
import { 
  AuthContainer, 
  AuthCard, 
  BrandTitle, 
  SubTitle, 
  FormContainer, 
  ToggleText 
} from './Auth.styles';

import { api, getApiError } from '../../services/api';
import { AuthContext } from '../../context/authContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hooks de roteamento e contexto global
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); 
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password } 
      : formData;
    
    try {
      const response = await api.post(endpoint, payload);

      const { token, data: userData } = response.data;

      login(token, userData);
      
      navigate('/');

    } catch (err: unknown) {
      setError(getApiError(err, 'Ocorreu um erro inesperado.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthContainer>
        <AuthCard elevation={0}>
          
          <BrandTitle variant="h4">
            CINERENT
          </BrandTitle>
          <SubTitle variant="body1">
            {isLogin ? 'Faça login para acessar o catálogo' : 'Crie sua conta e comece a alugar'}
          </SubTitle>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <FormContainer onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Nome completo"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            )}
            
            <TextField
              fullWidth
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <TextField
              fullWidth
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={loading}
              sx={{ mt: 1, borderRadius: '8px', py: 1.5 }}
            >
              {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </Button>
          </FormContainer>

          <ToggleText variant="body2">
            {isLogin ? 'Ainda não tem uma conta? ' : 'Já possui uma conta? '}
            <span onClick={toggleMode}>
              {isLogin ? 'Registre-se aqui' : 'Faça login'}
            </span>
          </ToggleText>

        </AuthCard>
      </AuthContainer>
    </MuiThemeProvider>
  );
}
