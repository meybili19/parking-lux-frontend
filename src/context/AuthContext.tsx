"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

// Definir el tipo de contexto
interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // Función de inicio de sesión
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:5004/login", {
        email,
        password,
      });

      if (response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token); // Guardar token en el almacenamiento local
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales incorrectas");
    }
  };

  // Función de cierre de sesión
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
