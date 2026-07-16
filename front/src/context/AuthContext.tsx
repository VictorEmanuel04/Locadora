import React, { createContext, useState, useEffect, type ReactNode } from 'react';

// Tipagem baseada no que o seu Controller do Express retorna
interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN'; 
}

// O que o contexto vai "distribuir" para o resto do app
interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// Criação do Contexto em si
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// O Provider é o componente que vai "abraçar" a sua aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Assim que o React carrega, ele checa se o usuário já havia logado antes
  useEffect(() => {
    const storagedUser = localStorage.getItem('@Cinerent:user');
    const storagedToken = localStorage.getItem('@Cinerent:token');

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
    }
  }, []);

  // Função que o seu Auth.tsx chama quando o Axios retorna sucesso
  const login = (token: string, userData: User) => {
    localStorage.setItem('@Cinerent:token', token);
    localStorage.setItem('@Cinerent:user', JSON.stringify(userData));
    setUser(userData);
  };

  // Função para deslogar e limpar a memória (usada na Navbar)
  const logout = () => {
    localStorage.removeItem('@Cinerent:token');
    localStorage.removeItem('@Cinerent:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};