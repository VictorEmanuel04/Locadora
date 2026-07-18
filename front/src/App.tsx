import { useContext, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/authContext';

// Importações ajustadas exatamente conforme a sua árvore de pastas
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth'; // Ajuste se o nome do arquivo interno for diferente (ex: Login.tsx)
import MovieCatalog from './components/Movies/MovieCatalog'; 
import MovieDetails from './components/MovieDetails/MovieDetails';
import Cart from './components/Cart/Cart';
import Profile from './components/Profile/Profile';
import Admin from './components/Admin/Admin'; // Adicionando a rota do Admin que vi que você tem!

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);
  return user?.role === 'ADMIN' ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      {/* A Navbar fixa no topo */}
      <Navbar />
      
      {/* Container principal com padding para a Navbar não cobrir o conteúdo */}
      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/catalogo" element={<MovieCatalog />} />
          <Route path="/filme/:id" element={<MovieDetails />} />
          <Route path="/carrinho" element={<RequireAuth><Cart /></RequireAuth>} />
          <Route path="/perfil" element={<RequireAuth><Profile /></RequireAuth>} />
          
          {/* Rota para o seu painel de administrador */}
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
