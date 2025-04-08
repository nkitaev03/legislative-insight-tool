/**
 * API интеграция с бэкендом для платформы управления рисками
 */

import { LegislationItem, NewsItem } from '../components/monitoring/types';
import { RiskData, BaseRisk, ApiResponse, PaginatedResponse, SimulationScenario, SimulationResult } from '../components/simulation/types';
import { User, Organization, UserDashboardPreferences, Action, RiskScenario } from '../types/dashboard';

// Базовый URL для API запросов
const API_BASE_URL = 'http://localhost:3001/api';

// Сохранение токена в localStorage
const saveToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Получение токена из localStorage
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Удаление токена из localStorage (для выхода из системы)
const removeToken = () => {
  localStorage.removeItem('auth_token');
};

// Создание заголовков для запросов
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Общая функция для обработки ответов
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  
  return response.json();
};

// Интерфейс для данных входа
interface LoginData {
  email: string;
  password: string;
}

// Интерфейс для ответа при входе
interface LoginResponse {
  token: string;
  user: User;
}

// Интерфейс для данных регистрации
interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  organizationId: string;
  role?: 'admin' | 'manager' | 'analyst' | 'viewer';
}

// Интерфейс для получения рисков с фильтрацией
interface RiskFilters {
  page?: number;
  pageSize?: number;
  category?: string | string[];
  severity?: string | string[];
  dateFrom?: string;
  dateTo?: string;
  responsible?: string | string[];
  status?: string | string[];
}

// API аутентификации
export const authApi = {
  // Вход в систему
  login: async (data: LoginData): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await handleResponse<LoginResponse>(response);
    
    if (result.status === 'success' && result.data) {
      saveToken(result.data.token);
    }
    
    return result;
  },
  
  // Регистрация нового пользователя
  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    return handleResponse<User>(response);
  },
  
  // Получение профиля текущего пользователя
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<User>(response);
  },
  
  // Обновление профиля
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    return handleResponse<User>(response);
  },
  
  // Смена пароля
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    return handleResponse<null>(response);
  },
  
  // Выход из системы
  logout: () => {
    removeToken();
  },
  
  // Проверка авторизации
  isAuthenticated: (): boolean => {
    return !!getToken();
  }
};

// API для работы с рисками
export const riskApi = {
  // Получение списка рисков с пагинацией и фильтрацией
  getRisks: async (filters?: RiskFilters): Promise<PaginatedResponse<RiskData>> => {
    // Формирование строки запроса из фильтров
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/risks?${queryParams.toString()}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    const result = await handleResponse<PaginatedResponse<RiskData>>(response);
    // Return the data directly instead of the ApiResponse wrapper
    return result.data;
  },
  
  // Получение одного риска по ID
  getRisk: async (id: string): Promise<ApiResponse<RiskData>> => {
    const response = await fetch(`${API_BASE_URL}/risks/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<RiskData>(response);
  },
  
  // Создание нового риска
  createRisk: async (risk: Omit<BaseRisk, 'id'>): Promise<ApiResponse<RiskData>> => {
    const response = await fetch(`${API_BASE_URL}/risks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(risk)
    });
    
    return handleResponse<RiskData>(response);
  },
  
  // Обновление риска
  updateRisk: async (id: string, risk: Partial<BaseRisk>): Promise<ApiResponse<RiskData>> => {
    const response = await fetch(`${API_BASE_URL}/risks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(risk)
    });
    
    return handleResponse<RiskData>(response);
  },
  
  // Удаление риска (только для админов)
  deleteRisk: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/risks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    return handleResponse<null>(response);
  },
  
  // Добавление ответа на риск
  addResponse: async (riskId: string, response: { title: string; description: string; responsible: string; status?: string; dueDate?: string }): Promise<ApiResponse<any>> => {
    const apiResponse = await fetch(`${API_BASE_URL}/risks/${riskId}/responses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(response)
    });
    
    return handleResponse(apiResponse);
  },
  
  // Получение статистики по рискам
  getRiskStatistics: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/risks/statistics/summary`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  }
};

// API для работы с законодательством
export const legislationApi = {
  // Получение списка законодательных актов
  getLegislationItems: async (page = 1, pageSize = 10): Promise<PaginatedResponse<LegislationItem>> => {
    const response = await fetch(`${API_BASE_URL}/legislation?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    const result = await handleResponse<PaginatedResponse<LegislationItem>>(response);
    // Return the data directly instead of the ApiResponse wrapper
    return result.data;
  },
  
  // Получение одного законодательного акта по ID
  getLegislationItem: async (id: string): Promise<ApiResponse<LegislationItem>> => {
    const response = await fetch(`${API_BASE_URL}/legislation/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<LegislationItem>(response);
  },
  
  // Создание нового законодательного акта
  createLegislationItem: async (item: Omit<LegislationItem, 'id'>): Promise<ApiResponse<LegislationItem>> => {
    const response = await fetch(`${API_BASE_URL}/legislation`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(item)
    });
    
    return handleResponse<LegislationItem>(response);
  },
  
  // Обновление законодательного акта
  updateLegislationItem: async (id: string, item: Partial<LegislationItem>): Promise<ApiResponse<LegislationItem>> => {
    const response = await fetch(`${API_BASE_URL}/legislation/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(item)
    });
    
    return handleResponse<LegislationItem>(response);
  },
  
  // Импорт законодательных актов из внешнего источника
  importLegislation: async (source: string): Promise<ApiResponse<{ imported: number }>> => {
    const response = await fetch(`${API_BASE_URL}/legislation/import`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ source })
    });
    
    return handleResponse<{ imported: number }>(response);
  }
};

// API для работы с новостями
export const newsApi = {
  // Получение списка новостей
  getNewsItems: async (page = 1, pageSize = 10): Promise<PaginatedResponse<NewsItem>> => {
    const response = await fetch(`${API_BASE_URL}/news?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    const result = await handleResponse<PaginatedResponse<NewsItem>>(response);
    // Return the data directly instead of the ApiResponse wrapper
    return result.data;
  },
  
  // Получение одной новости по ID
  getNewsItem: async (id: string): Promise<ApiResponse<NewsItem>> => {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<NewsItem>(response);
  },
  
  // Создание новой новости
  createNewsItem: async (item: Omit<NewsItem, 'id'>): Promise<ApiResponse<NewsItem>> => {
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(item)
    });
    
    return handleResponse<NewsItem>(response);
  },
  
  // Обновление новости
  updateNewsItem: async (id: string, item: Partial<NewsItem>): Promise<ApiResponse<NewsItem>> => {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(item)
    });
    
    return handleResponse<NewsItem>(response);
  },
  
  // Импорт новостей из внешнего источника
  importNews: async (source: string): Promise<ApiResponse<{ imported: number }>> => {
    const response = await fetch(`${API_BASE_URL}/news/import`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ source })
    });
    
    return handleResponse<{ imported: number }>(response);
  }
};

// API для работы с симуляциями
export const simulationApi = {
  // Получение списка всех симуляций
  getSimulations: async (): Promise<ApiResponse<SimulationScenario[]>> => {
    const response = await fetch(`${API_BASE_URL}/simulations`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<SimulationScenario[]>(response);
  },
  
  // Получение конкретной симуляции
  getSimulation: async (id: string): Promise<ApiResponse<SimulationScenario>> => {
    const response = await fetch(`${API_BASE_URL}/simulations/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<SimulationScenario>(response);
  },
  
  // Создание новой симуляции
  createSimulation: async (simulation: { 
    name: string; 
    type?: 'base' | 'stress' | 'custom'; 
    parameters: {
      simulationRuns: number;
      confidenceLevel: number;
      distributionType: string;
      stressTestCoefficient?: number;
      includeCorrelations?: boolean;
    }
  }): Promise<ApiResponse<SimulationScenario>> => {
    const response = await fetch(`${API_BASE_URL}/simulations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(simulation)
    });
    
    return handleResponse<SimulationScenario>(response);
  },
  
  // Запуск симуляции
  runSimulation: async (id: string, riskIds: string[]): Promise<ApiResponse<{ simulationId: string; results: SimulationResult[] }>> => {
    const response = await fetch(`${API_BASE_URL}/simulations/${id}/run`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ riskIds })
    });
    
    return handleResponse<{ simulationId: string; results: SimulationResult[] }>(response);
  },
  
  // Получение результатов симуляции
  getSimulationResults: async (id: string): Promise<ApiResponse<SimulationResult[]>> => {
    const response = await fetch(`${API_BASE_URL}/simulations/${id}/results`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<SimulationResult[]>(response);
  },
  
  // Сравнение симуляций
  compareSimulations: async (simulationIds: string[]): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/simulations/compare`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ simulationIds })
    });
    
    return handleResponse(response);
  }
};

// API для работы с панелью управления
export const dashboardApi = {
  // Получение настроек панели управления пользователя
  getUserDashboardPreferences: async (): Promise<ApiResponse<UserDashboardPreferences>> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/preferences`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<UserDashboardPreferences>(response);
  },
  
  // Обновление настроек панели управления
  updateUserDashboardPreferences: async (preferences: Partial<UserDashboardPreferences>): Promise<ApiResponse<UserDashboardPreferences>> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/preferences`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(preferences)
    });
    
    return handleResponse<UserDashboardPreferences>(response);
  },
  
  // Получение KPI данных
  getKpiData: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/kpi`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  }
};

// API для работы с организацией
export const organizationApi = {
  // Получение данных организации
  getOrganization: async (): Promise<ApiResponse<Organization>> => {
    const response = await fetch(`${API_BASE_URL}/organization`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<Organization>(response);
  },
  
  // Обновление данных организации
  updateOrganization: async (data: Partial<Organization>): Promise<ApiResponse<Organization>> => {
    const response = await fetch(`${API_BASE_URL}/organization`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    return handleResponse<Organization>(response);
  },
  
  // Получение настроек организации
  getOrganizationSettings: async (): Promise<ApiResponse<Organization['settings']>> => {
    const response = await fetch(`${API_BASE_URL}/organization/settings`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<Organization['settings']>(response);
  },
  
  // Обновление настроек организации
  updateOrganizationSettings: async (settings: Partial<Organization['settings']>): Promise<ApiResponse<Organization['settings']>> => {
    const response = await fetch(`${API_BASE_URL}/organization/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });
    
    return handleResponse<Organization['settings']>(response);
  }
};

// API для управления пользователями (только для админов)
export const userApi = {
  // Получение списка всех пользователей
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<User[]>(response);
  },
  
  // Получение конкретного пользователя
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse<User>(response);
  },
  
  // Создание нового пользователя
  createUser: async (user: RegisterData): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(user)
    });
    
    return handleResponse<User>(response);
  },
  
  // Обновление пользователя
  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    return handleResponse<User>(response);
  },
  
  // Удаление пользователя
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    return handleResponse<null>(response);
  },
  
  // Обновление роли пользователя
  updateUserRole: async (id: string, role: 'admin' | 'manager' | 'analyst' | 'viewer'): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role })
    });
    
    return handleResponse<User>(response);
  }
};

// Объединение всех API в один объект для удобства импорта
const api = {
  auth: authApi,
  risks: riskApi,
  legislation: legislationApi,
  news: newsApi,
  simulations: simulationApi,
  dashboard: dashboardApi,
  organization: organizationApi,
  users: userApi
};

export default api;
