import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./authContext";

// O Provider é o componente que vai "abraçar" a sua aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedToken = localStorage.getItem("@Cinerent:token");
    const storedUser = localStorage.getItem("@Cinerent:user");
    if (!storedToken || !storedUser) return null;
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem("@Cinerent:token");
      localStorage.removeItem("@Cinerent:user");
      return null;
    }
  });

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
