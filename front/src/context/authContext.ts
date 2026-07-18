import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "ADMIN";
}

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);
