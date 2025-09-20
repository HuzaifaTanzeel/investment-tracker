import { Transaction, Holding, PnLSummary, MonthlyPnL, YearlyPnL, RealizedPnL, ScriptPnL } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

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
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle our API response format
    if (data.success === false) {
      throw new Error(data.error || 'API request failed');
    }
    
    // Return the data field if it exists, otherwise return the whole response
    return data.data !== undefined ? data.data : data;
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
  create: async (transaction: {
    transactionDate: string;
    symbol: string;
    activity: 'BUY' | 'SELL';
    quantity: number;
    rate: number;
  }) => {
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
  // Get current holdings and summary
  getAll: async () => {
    return apiRequest<{ holdings: Holding[]; summary: PnLSummary }>('/portfolio');
  },

  // Get current holdings
  getHoldings: async () => {
    const data = await apiRequest<{ holdings: any[]; summary: any }>('/portfolio');
    return data.holdings.map((h: any) => ({
      symbol: h.symbol,
      quantity: h.availableQuantity,
      avgCost: h.avgCostPerShare,
      totalInvested: h.totalInvestedAmount,
      currentValue: undefined,
      unrealizedPnL: undefined,
    }));
  },

  // Get portfolio summary
  getSummary: async () => {
    const data = await apiRequest<{ holdings: any[]; summary: any }>('/portfolio');
    return {
      totalInvested: data.summary.totalInvested,
      totalRecovered: data.summary.totalRecovered,
      realizedPnL: data.summary.totalRealizedPnL,
      unrealizedPnL: 0,
      currentMonthPnL: 0,
      totalCharges: 0,
    };
  },

  // Get holdings for specific script
  getScriptHolding: async (symbol: string) => {
    const data = await apiRequest<{ details: any; transactions: any[]; realizedPnL: any[] }>(`/portfolio/${symbol}`);
    return {
      symbol: data.details.symbol,
      quantity: data.details.availableQuantity,
      avgCost: data.details.avgCostPerShare,
      totalInvested: data.details.totalInvestedAmount,
      currentValue: data.details.currentValue,
      unrealizedPnL: data.details.unrealizedPnL,
    };
  },

  // Get available shares for selling
  getAvailableShares: async () => {
    const data = await apiRequest<{ holdings: any[] }>('/portfolio');
    return data.holdings.reduce((acc, holding) => {
      acc[holding.symbol] = holding.availableQuantity;
      return acc;
    }, {} as Record<string, number>);
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
    return apiRequest<ScriptPnL[]>('/reports/script-wise');
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
