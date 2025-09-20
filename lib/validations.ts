import { z } from 'zod'
import { Activity } from '@prisma/client'

// Transaction validation schemas
export const TransactionCreateSchema = z.object({
  transactionDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  symbol: z.string().min(1).max(10).transform(val => val.toUpperCase()),
  activity: z.nativeEnum(Activity),
  quantity: z.number().positive().int(),
  rate: z.number().positive(),
})

export const TransactionUpdateSchema = TransactionCreateSchema.partial()

export const TransactionQuerySchema = z.object({
  symbol: z.string().optional(),
  activity: z.nativeEnum(Activity).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
})

// Response DTOs
export interface PortfolioSummaryDTO {
  totalInvested: number
  totalRecovered: number
  totalRealizedPnL: number
  totalHoldings: number
  activeScripts: number
}

export interface MonthlyPnLDTO {
  month: number
  year: number
  totalProfit: number
  totalLoss: number
  netPnL: number
  transactionCount: number
}

export interface ScriptDetailsDTO {
  symbol: string
  availableQuantity: number
  avgCostPerShare: number
  totalInvestedAmount: number
  totalRealizedPnL: number
  currentValue?: number
  unrealizedPnL?: number
}

export interface YearlyPnLDTO {
  year: number
  totalPnL: number
  totalTransactions: number
  totalCharges: number
  monthlyBreakdown: MonthlyPnLDTO[]
}

export interface ScriptPnLDTO {
  symbol: string
  totalPnL: number
  totalQuantityTraded: number
  totalInvested: number
  totalRecovered: number
  avgBuyRate: number
  avgSellRate: number
}

export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateSchema>
export type TransactionQuery = z.infer<typeof TransactionQuerySchema>

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
