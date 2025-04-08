
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/api';
import { User } from '../types/dashboard';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    organizationId: string;
    role?: 'admin' | 'manager' | 'analyst' | 'viewer';
  }) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        if (authApi.isAuthenticated()) {
          const response = await authApi.getProfile();
          if (response.status === 'success' && response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            // Если токен недействителен, выходим из системы
            authApi.logout();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        authApi.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Вход в систему
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.login({ email, password });
      
      if (response.status === 'success' && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast({
          title: "Успешный вход",
          description: "Вы успешно вошли в систему",
        });
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Ошибка входа. Пожалуйста, проверьте учетные данные.');
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: error.message || 'Пожалуйста, проверьте учетные данные.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Выход из системы
  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из системы",
    });
  };

  // Регистрация нового пользователя
  const register = async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    organizationId: string;
    role?: 'admin' | 'manager' | 'analyst' | 'viewer';
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.register(userData);
      
      if (response.status === 'success') {
        toast({
          title: "Регистрация успешна",
          description: "Теперь вы можете войти в систему",
        });
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      setError(error.message || 'Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: error.message || 'Пожалуйста, попробуйте еще раз.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление профиля
  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.updateProfile(data);
      
      if (response.status === 'success' && response.data) {
        setUser(prevUser => ({
          ...prevUser!,
          ...response.data
        }));
        toast({
          title: "Профиль обновлен",
          description: "Ваш профиль успешно обновлен",
        });
      }
    } catch (error: any) {
      console.error('Profile update failed:', error);
      setError(error.message || 'Ошибка обновления профиля. Пожалуйста, попробуйте еще раз.');
      toast({
        variant: "destructive",
        title: "Ошибка обновления профиля",
        description: error.message || 'Пожалуйста, попробуйте еще раз.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Смена пароля
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.changePassword(currentPassword, newPassword);
      
      if (response.status === 'success') {
        toast({
          title: "Пароль изменен",
          description: "Ваш пароль был успешно изменен",
        });
      }
    } catch (error: any) {
      console.error('Password change failed:', error);
      setError(error.message || 'Ошибка изменения пароля. Пожалуйста, проверьте текущий пароль.');
      toast({
        variant: "destructive",
        title: "Ошибка изменения пароля",
        description: error.message || 'Пожалуйста, проверьте текущий пароль.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
