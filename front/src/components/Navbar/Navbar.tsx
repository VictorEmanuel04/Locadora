import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem,
  ListItemIcon
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { muiTheme } from '../../styles/theme';
import { AuthContext } from '../../context/authContext';

import { 
  NavContainer, 
  NavContent, 
  LogoSection, 
  BrandName, 
  LinksSection, 
  NavLink, 
  ActionSection, 
  LoginButton 
} from './Navbar.styles';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  // Estado para controlar o menu suspenso do perfil
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    if (logout) {
      logout();
    }
    navigate('/');
  };

  const goTo = (path: string) => {
    navigate(path);
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <NavContainer>
        <NavContent>
          
          {/* LOGO */}
          <LogoSection onClick={() => goTo('/')}>
            <BrandName>CINERENT</BrandName>
          </LogoSection>

          {/* LINKS CENTRAIS */}
          <LinksSection>
            <NavLink 
              active={location.pathname === '/'} 
              onClick={() => goTo('/')}
            >
              Início
            </NavLink>
            <NavLink 
              active={location.pathname.includes('/catalogo')} 
              onClick={() => goTo('/catalogo')}
            >
              Catálogo
            </NavLink>
          </LinksSection>

          {/* AÇÕES (CARRINHO E PERFIL/LOGIN) */}
          <ActionSection>
            
            {/* Ícone do Carrinho (qualquer um pode ver, mas redireciona pro login se não tiver logado) */}
            <IconButton 
              color="inherit" 
              onClick={() => goTo('/carrinho')}
              sx={{ color: 'white' }}
            >
              <ShoppingCartIcon />
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>

                {/* Menu suspenso do Perfil */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleProfileMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  sx={{
                    '& .MuiPaper-root': {
                      bgcolor: '#1A1A24',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mt: 1.5,
                    }
                  }}
                >
                  <MenuItem onClick={() => { handleProfileMenuClose(); goTo('/perfil'); }}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" sx={{ color: 'white' }} />
                    </ListItemIcon>
                    Minha Conta
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: '#F44336' }} />
                    </ListItemIcon>
                    Sair
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <LoginButton 
                variant="contained" 
                color="primary" 
                onClick={() => goTo('/auth')}
              >
                Entrar
              </LoginButton>
            )}

          </ActionSection>
        </NavContent>
      </NavContainer>
    </MuiThemeProvider>
  );
}
