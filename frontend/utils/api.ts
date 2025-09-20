import { Transaction, Holding, PnLSummary, MonthlyPnL, YearlyPnL, RealizedPnL, ScriptPnL } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Transaction API
export const transactionApi = {
  // Get all transactions with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    symbol?: string;
    type?: 'BUY' | 'SELL';
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/transactions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest<{ data: Transaction[]; total: number; page: number; limit: number }>(endpoint);
  },

  // Get transaction by ID
  getById: async (id: string) => {
    return apiRequest<Transaction>(`/transactions/${id}`);
  },

  // Create new transaction
  create: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  // Update transaction
  update: async (id: string, transaction: Partial<Transaction>) => {
    return apiRequest<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  },

  // Delete transaction
  delete: async (id: string) => {
    return apiRequest<{ success: boolean }>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  // Get recent transactions
  getRecent: async (limit: number = 5) => {
    return apiRequest<Transaction[]>(`/transactions/recent?limit=${limit}`);
  },
};

// Portfolio API
export const portfolioApi = {
  // Get current holdings
  getHoldings: async () => {
    return apiRequest<Holding[]>('/portfolio/holdings');
  },

  // Get portfolio summary
  getSummary: async () => {
    return apiRequest<PnLSummary>('/portfolio/summary');
  },

  // Get holdings for specific script
  getScriptHolding: async (symbol: string) => {
    return apiRequest<Holding>(`/portfolio/script/${symbol}`);
  },

  // Get available shares for selling
  getAvailableShares: async () => {
    return apiRequest<Record<string, number>>('/portfolio/available-shares');
  },
};

// Reports API
export const reportsApi = {
  // Get monthly P&L
  getMonthlyPnL: async (year?: number) => {
    const endpoint = year ? `/reports/monthly/${year}` : '/reports/monthly';
    return apiRequest<MonthlyPnL[]>(endpoint);
  },

  // Get yearly P&L
  getYearlyPnL: async () => {
    return apiRequest<YearlyPnL[]>('/reports/yearly');
  },

  // Get realized P&L
  getRealizedPnL: async (params?: {
    symbol?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value);
        }
      });
    }
    
    const endpoint = `/reports/realized-pnl${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest<RealizedPnL[]>(endpoint);
  },

  // Get script-wise P&L
  getScriptPnL: async () => {
    return apiRequest<ScriptPnL[]>('/reports/script-pnl');
  },

  // Get current month P&L
  getCurrentMonthPnL: async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return apiRequest<MonthlyPnL>(`/reports/monthly/${year}/${month}`);
  },
};

// Health check
export const healthApi = {
  check: async () => {
    return apiRequest<{ status: string; timestamp: string }>('/health');
  },
};

// Export default API object
export const api = {
  transactions: transactionApi,
  portfolio: portfolioApi,
  reports: reportsApi,
  health: healthApi,
};
