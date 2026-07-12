import React, { useState } from 'react';
import { 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  TextField, 
  Button, 
  Alert
} from '@mui/material';

// Importando o tema do Material UI que criamos anteriormente
// (Assumindo que você o exportou de um arquivo de configuração ou do AdminMovies.styles)
import { muiTheme } from '../Admin/Admin.styles'; 

import { 
  AuthContainer, 
  AuthCard, 
  BrandTitle, 
  SubTitle, 
  FormContainer, 
  ToggleText 
} from './Auth.styles';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Limpa o erro ao digitar
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Define a rota com base no modo (Login ou Register)
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isLogin 
            ? { email: formData.email, password: formData.password } 
            : formData
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ocorreu um erro inesperado.');
      }

      // Sucesso! Salva o token JWT no localStorage
      localStorage.setItem('@Cinerent:token', result.token);
      
      // Aqui você pode redirecionar o usuário para a Home ou para o Painel Admin
      console.log('Autenticado com sucesso!', result.data);
      // window.location.href = '/admin'; 

    } catch (err: any) {
      setError(err.message);
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