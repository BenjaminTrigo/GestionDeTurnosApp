import React, { createContext, useCallback, useEffect, useState } from 'react';
import { api } from '../api/axios';

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: 'admin' | 'cliente';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    const verifySession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Validar token con el backend
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error verificando sesión:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);

      // Configurar header de autorización por defecto
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (nombre: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { nombre, email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;

      const adminPermissions = ['create_service', 'edit_service', 'delete_service', 'view_analytics'];
      const clientPermissions = ['reserve_appointment', 'view_my_appointments', 'cancel_appointment'];

      if (user.role === 'admin') {
        return adminPermissions.includes(permission);
      } else if (user.role === 'cliente') {
        return clientPermissions.includes(permission);
      }

      return false;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        isAdmin,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};