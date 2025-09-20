// Core types for PSX Investment Tracker

export interface Transaction {
  id: string;
  date: string; // ISO date string
  type: 'BUY' | 'SELL';
  symbol: string; // PSX stock symbol (e.g., TRG, OGDC)
  quantity: number;
  rate: number; // Price per share
  commission: number;
  sst: number; // Sales & Services Tax
  cdc: number; // Central Depository Company charges
  totalCharges: number;
  netAmount: number; // Total amount including charges
  createdAt?: string;
  updatedAt?: string;
}

export interface Holding {
  symbol: string;
  quantity: number; // Available shares
  avgCost: number; // Average cost per share
  totalInvested: number; // Total amount invested
  currentValue?: number; // Current market value
  unrealizedPnL?: number; // Unrealized profit/loss
}

export interface PnLSummary {
  totalInvested: number;
  totalRecovered: number; // Amount recovered from selling
  realizedPnL: number; // Realized profit/loss
  unrealizedPnL?: number; // Unrealized profit/loss
  currentMonthPnL: number;
  totalCharges: number; // Total charges paid
}

export interface RealizedPnL {
  id: string;
  sellTransactionId: string;
  symbol: string;
  sellDate: string;
  quantitySold: number;
  sellRate: number;
  avgBuyRate: number;
  profitLoss: number;
  profitLossPercentage: number;
  sellCharges: number;
}

export interface MonthlyPnL {
  year: number;
  month: number;
  monthName: string;
  totalPnL: number;
  totalTransactions: number;
  totalCharges: number;
}

export interface YearlyPnL {
  year: number;
  totalPnL: number;
  totalTransactions: number;
  totalCharges: number;
  monthlyBreakdown: MonthlyPnL[];
}

export interface ScriptPnL {
  symbol: string;
  totalPnL: number;
  totalQuantityTraded: number;
  totalInvested: number;
  totalRecovered: number;
  avgBuyRate: number;
  avgSellRate: number;
}

// PSX specific constants
export const PSX_CHARGES = {
  COMMISSION_RATE: 0.0015, // 0.15%
  SST_RATE: 0.16, // 16% on commission
  CDC_RATE: 0.0002, // 0.02%
  MIN_COMMISSION: 20, // Minimum commission in PKR
} as const;

// Form validation types
export interface TransactionFormData {
  date: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  quantity: string;
  rate: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
