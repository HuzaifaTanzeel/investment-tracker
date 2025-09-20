import { pgTable, serial, text, integer, real, timestamp, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Transactions table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  transactionDate: timestamp('transaction_date').notNull(),
  symbol: text('symbol').notNull(),
  activity: text('activity').notNull(), // 'BUY' or 'SELL'
  quantity: integer('quantity').notNull(),
  rate: real('rate').notNull(), // Price per share
  amount: real('amount').notNull(), // quantity * rate
  commission: real('commission').notNull(), // Broker commission
  sst: real('sst').notNull(), // Sales & Services Tax
  cdc: real('cdc').notNull(), // Central Depository Company charges
  totalCharges: real('total_charges').notNull(),
  netAmount: real('net_amount').notNull(), // Final amount after charges
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Portfolio holdings table
export const portfolioHoldings = pgTable('portfolio_holdings', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').notNull().unique(),
  availableQuantity: integer('available_quantity').notNull().default(0),
  avgCostPerShare: real('avg_cost_per_share').notNull().default(0),
  totalInvestedAmount: real('total_invested_amount').notNull().default(0),
  totalSharesBought: integer('total_shares_bought').notNull().default(0),
  totalSharesSold: integer('total_shares_sold').notNull().default(0),
  totalRealizedPnL: real('total_realized_pnl').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Realized P&L table
export const realizedPnL = pgTable('realized_pnl', {
  id: serial('id').primaryKey(),
  transactionId: integer('transaction_id').notNull().references(() => transactions.id, { onDelete: 'cascade' }),
  symbol: text('symbol').notNull(),
  sellDate: timestamp('sell_date').notNull(),
  quantitySold: integer('quantity_sold').notNull(),
  sellRate: real('sell_rate').notNull(),
  avgCostBasis: real('avg_cost_basis').notNull(),
  grossProceeds: real('gross_proceeds').notNull(),
  netProceeds: real('net_proceeds').notNull(),
  costBasis: real('cost_basis').notNull(),
  realizedPnL: real('realized_pnl').notNull(),
  pnLPercentage: real('pnl_percentage').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const transactionsRelations = relations(transactions, ({ many }) => ({
  realizedPnL: many(realizedPnL),
}))

export const realizedPnLRelations = relations(realizedPnL, ({ one }) => ({
  transaction: one(transactions, {
    fields: [realizedPnL.transactionId],
    references: [transactions.id],
  }),
}))

// Types
export type Transaction = typeof transactions.$inferSelect
export type NewTransaction = typeof transactions.$inferInsert
export type PortfolioHolding = typeof portfolioHoldings.$inferSelect
export type NewPortfolioHolding = typeof portfolioHoldings.$inferInsert
export type RealizedPnL = typeof realizedPnL.$inferSelect
export type NewRealizedPnL = typeof realizedPnL.$inferInsert
