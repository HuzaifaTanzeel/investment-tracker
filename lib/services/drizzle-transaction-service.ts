import { db } from '@/lib/db'
import { transactions, portfolioHoldings, realizedPnL, type Transaction, type NewTransaction } from '@/lib/db/schema'
import { InvestmentCalculations } from '@/lib/calculations'
import { TransactionCreateInput, TransactionQuery } from '@/lib/validations'
import { eq, desc, and, gte, lte, sql, sum, avg, count } from 'drizzle-orm'

export class DrizzleTransactionService {
  /**
   * Create a new transaction with automatic calculations
   */
  static async createTransaction(input: TransactionCreateInput) {
    return await db.transaction(async (tx) => {
      const { transactionDate, symbol, activity, quantity, rate } = input
      const amount = quantity * rate
      const charges = InvestmentCalculations.calculateCharges(rate, amount, quantity)
      
      // For SELL transactions, validate available quantity
      if (activity === 'SELL') {
        await this.validateSellTransaction(symbol, quantity, tx)
      }

      // Create the transaction
      const [transaction] = await tx.insert(transactions).values({
        transactionDate: new Date(transactionDate),
        symbol: symbol.toUpperCase(),
        activity,
        quantity,
        rate,
        amount,
        commission: charges.commission,
        sst: charges.sst,
        cdc: charges.cdc,
        totalCharges: charges.totalCharges,
        netAmount: activity === 'BUY' 
          ? amount + charges.totalCharges 
          : amount - charges.totalCharges,
        updatedAt: new Date()
      }).returning()

      // Update portfolio state
      if (activity === 'BUY') {
        await this.updatePortfolioOnBuy(transaction, tx)
      } else {
        await this.updatePortfolioOnSell(transaction, tx)
      }

      return transaction
    })
  }

  /**
   * Validate sell transaction against available quantity
   */
  private static async validateSellTransaction(
    symbol: string, 
    sellQty: number, 
    tx: any
  ) {
    const [holding] = await tx
      .select()
      .from(portfolioHoldings)
      .where(eq(portfolioHoldings.symbol, symbol))
      .limit(1)

    if (!holding || holding.availableQuantity < sellQty) {
      throw new Error(`Insufficient quantity. Available: ${holding?.availableQuantity || 0}, Requested: ${sellQty}`)
    }
  }

  /**
   * Update portfolio on BUY transaction
   */
  private static async updatePortfolioOnBuy(transaction: Transaction, tx: any) {
    const [existing] = await tx
      .select()
      .from(portfolioHoldings)
      .where(eq(portfolioHoldings.symbol, transaction.symbol))
      .limit(1)

    const newTotalCost = Number(transaction.netAmount)

    if (existing) {
      const newAvgCost = InvestmentCalculations.calculateNewAverageCost(
        existing.availableQuantity,
        Number(existing.avgCostPerShare),
        transaction.quantity,
        newTotalCost
      )

      await tx
        .update(portfolioHoldings)
        .set({
          availableQuantity: existing.availableQuantity + transaction.quantity,
          avgCostPerShare: newAvgCost,
          totalInvestedAmount: Number(existing.totalInvestedAmount) + newTotalCost,
          totalSharesBought: existing.totalSharesBought + transaction.quantity,
          updatedAt: new Date()
        })
        .where(eq(portfolioHoldings.symbol, transaction.symbol))
    } else {
      await tx.insert(portfolioHoldings).values({
        symbol: transaction.symbol,
        availableQuantity: transaction.quantity,
        avgCostPerShare: Number(transaction.rate),
        totalInvestedAmount: newTotalCost,
        totalSharesBought: transaction.quantity,
        totalSharesSold: 0,
        totalRealizedPnL: 0,
        updatedAt: new Date()
      })
    }
  }

  /**
   * Update portfolio on SELL transaction
   */
  private static async updatePortfolioOnSell(transaction: Transaction, tx: any) {
    const [holding] = await tx
      .select()
      .from(portfolioHoldings)
      .where(eq(portfolioHoldings.symbol, transaction.symbol))
      .limit(1)

    if (!holding) throw new Error('No holding found for symbol')

    // Calculate realized P/L
    const pnLData = InvestmentCalculations.calculateRealizedPnL(
      transaction.quantity,
      Number(transaction.rate),
      Number(holding.avgCostPerShare),
      Number(transaction.totalCharges)
    )

    // Create P/L record
    await tx.insert(realizedPnL).values({
      transactionId: transaction.id,
      symbol: transaction.symbol,
      sellDate: transaction.transactionDate,
      quantitySold: transaction.quantity,
      sellRate: transaction.rate,
      avgCostBasis: holding.avgCostPerShare,
      grossProceeds: pnLData.grossProceeds,
      netProceeds: pnLData.netProceeds,
      costBasis: pnLData.costBasis,
      realizedPnL: pnLData.realizedPnL,
      pnLPercentage: pnLData.pnLPercentage
    })

    // Update portfolio holding
    await tx
      .update(portfolioHoldings)
      .set({
        availableQuantity: holding.availableQuantity - transaction.quantity,
        totalSharesSold: holding.totalSharesSold + transaction.quantity,
        totalRealizedPnL: Number(holding.totalRealizedPnL) + pnLData.realizedPnL,
        updatedAt: new Date()
      })
      .where(eq(portfolioHoldings.symbol, transaction.symbol))
  }

  /**
   * Get transactions with optional filtering
   */
  static async getTransactions(query: TransactionQuery) {
    const { symbol, activity, startDate, endDate, page = 1, limit = 50 } = query
    const offset = (page - 1) * limit

    let whereConditions = []
    
    if (symbol) whereConditions.push(eq(transactions.symbol, symbol.toUpperCase()))
    if (activity) whereConditions.push(eq(transactions.activity, activity))
    if (startDate) whereConditions.push(gte(transactions.transactionDate, new Date(startDate)))
    if (endDate) whereConditions.push(lte(transactions.transactionDate, new Date(endDate)))

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    const [transactionList, [{ count: total }]] = await Promise.all([
      db
        .select()
        .from(transactions)
        .where(whereClause)
        .orderBy(desc(transactions.transactionDate))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(transactions)
        .where(whereClause)
    ])

    return {
      data: transactionList,
      pagination: {
        total: Number(total),
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(Number(total) / Number(limit))
      }
    }
  }

  /**
   * Get single transaction by ID
   */
  static async getTransactionById(id: number) {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1)

    if (!transaction) return null

    const pnlRecords = await db
      .select()
      .from(realizedPnL)
      .where(eq(realizedPnL.transactionId, id))

    return {
      ...transaction,
      realizedPnL: pnlRecords
    }
  }

  /**
   * Delete transaction and recalculate portfolio
   */
  static async deleteTransaction(id: number) {
    return await db.transaction(async (tx) => {
      const [transaction] = await tx
        .select()
        .from(transactions)
        .where(eq(transactions.id, id))
        .limit(1)

      if (!transaction) throw new Error('Transaction not found')

      // Delete related P/L records
      await tx
        .delete(realizedPnL)
        .where(eq(realizedPnL.transactionId, id))

      // Delete transaction
      await tx
        .delete(transactions)
        .where(eq(transactions.id, id))

      // Recalculate portfolio for this symbol
      await this.recalculatePortfolio(transaction.symbol, tx)
    })
  }

  /**
   * Recalculate entire portfolio state for a symbol
   */
  private static async recalculatePortfolio(symbol: string, tx: any) {
    // Get all transactions for this symbol in chronological order
    const symbolTransactions = await tx
      .select()
      .from(transactions)
      .where(eq(transactions.symbol, symbol))
      .orderBy(transactions.transactionDate)

    // Reset portfolio holding
    await tx
      .delete(portfolioHoldings)
      .where(eq(portfolioHoldings.symbol, symbol))

    // Delete existing P/L records
    await tx
      .delete(realizedPnL)
      .where(eq(realizedPnL.symbol, symbol))

    // Replay all transactions
    for (const transaction of symbolTransactions) {
      if (transaction.activity === 'BUY') {
        await this.updatePortfolioOnBuy(transaction, tx)
      } else {
        await this.updatePortfolioOnSell(transaction, tx)
      }
    }
  }

  /**
   * Get portfolio summary
   */
  static async getPortfolioSummary() {
    const [holdings, stats, sellStats] = await Promise.all([
      db.select().from(portfolioHoldings).orderBy(portfolioHoldings.symbol),
      db
        .select({
          totalInvested: sum(portfolioHoldings.totalInvestedAmount),
          totalRealizedPnL: sum(portfolioHoldings.totalRealizedPnL),
          totalHoldings: sum(portfolioHoldings.availableQuantity),
          activeScripts: count()
        })
        .from(portfolioHoldings),
      db
        .select({
          totalRecovered: sum(transactions.netAmount)
        })
        .from(transactions)
        .where(eq(transactions.activity, 'SELL'))
    ])

    const summary = {
      totalInvested: Number(stats[0]?.totalInvested || 0),
      totalRecovered: Number(sellStats[0]?.totalRecovered || 0),
      totalRealizedPnL: Number(stats[0]?.totalRealizedPnL || 0),
      totalHoldings: Number(stats[0]?.totalHoldings || 0),
      activeScripts: Number(stats[0]?.activeScripts || 0)
    }

    return {
      holdings,
      summary
    }
  }

  /**
   * Get script details with transactions and P/L history
   */
  static async getScriptDetails(symbol: string) {
    const upperSymbol = symbol.toUpperCase()
    
    const [holding] = await db
      .select()
      .from(portfolioHoldings)
      .where(eq(portfolioHoldings.symbol, upperSymbol))
      .limit(1)

    if (!holding) {
      throw new Error('Script not found in portfolio')
    }

    const [scriptTransactions, scriptRealizedPnL] = await Promise.all([
      db
        .select()
        .from(transactions)
        .where(eq(transactions.symbol, upperSymbol))
        .orderBy(desc(transactions.transactionDate)),
      db
        .select()
        .from(realizedPnL)
        .where(eq(realizedPnL.symbol, upperSymbol))
        .orderBy(desc(realizedPnL.sellDate))
    ])

    const details = {
      symbol: holding.symbol,
      availableQuantity: holding.availableQuantity,
      avgCostPerShare: Number(holding.avgCostPerShare),
      totalInvestedAmount: Number(holding.totalInvestedAmount),
      totalRealizedPnL: Number(holding.totalRealizedPnL)
    }

    return {
      details,
      transactions: scriptTransactions,
      realizedPnL: scriptRealizedPnL
    }
  }

  /**
   * Get realized P/L reports with filtering
   */
  static async getRealizedPnL(filters: {
    symbol?: string
    startDate?: string
    endDate?: string
  }) {
    let whereConditions = []
    
    if (filters.symbol) whereConditions.push(eq(realizedPnL.symbol, filters.symbol.toUpperCase()))
    if (filters.startDate) whereConditions.push(gte(realizedPnL.sellDate, new Date(filters.startDate)))
    if (filters.endDate) whereConditions.push(lte(realizedPnL.sellDate, new Date(filters.endDate)))

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    return await db
      .select({
        realizedPnL: realizedPnL,
        transaction: {
          transactionDate: transactions.transactionDate,
          totalCharges: transactions.totalCharges
        }
      })
      .from(realizedPnL)
      .leftJoin(transactions, eq(realizedPnL.transactionId, transactions.id))
      .where(whereClause)
      .orderBy(desc(realizedPnL.sellDate))
  }
}
