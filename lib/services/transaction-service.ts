import { prisma } from '@/lib/db'
import { InvestmentCalculations } from '@/lib/calculations'
import { TransactionCreateInput, TransactionUpdateInput, TransactionQuery } from '@/lib/validations'

export class TransactionService {
  /**
   * Create a new transaction with automatic calculations
   */
  static async createTransaction(input: TransactionCreateInput) {
    return await prisma.$transaction(async (tx) => {
      const { transactionDate, symbol, activity, quantity, rate } = input
      const amount = quantity * rate
      const charges = InvestmentCalculations.calculateCharges(rate, amount, quantity)
      
      // For SELL transactions, validate available quantity
      if (activity === 'SELL') {
        await this.validateSellTransaction(symbol, quantity, tx)
      }

      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
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
            : amount - charges.totalCharges
        }
      })

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
    const holding = await tx.portfolioHolding.findUnique({
      where: { symbol }
    })

    if (!holding || holding.availableQuantity < sellQty) {
      throw new Error(`Insufficient quantity. Available: ${holding?.availableQuantity || 0}, Requested: ${sellQty}`)
    }
  }

  /**
   * Update portfolio on BUY transaction
   */
  private static async updatePortfolioOnBuy(transaction: any, tx: any) {
    const existing = await tx.portfolioHolding.findUnique({
      where: { symbol: transaction.symbol }
    })

    const newTotalCost = Number(transaction.netAmount)

    if (existing) {
      const newAvgCost = InvestmentCalculations.calculateNewAverageCost(
        existing.availableQuantity,
        Number(existing.avgCostPerShare),
        transaction.quantity,
        newTotalCost
      )

      await tx.portfolioHolding.update({
        where: { symbol: transaction.symbol },
        data: {
          availableQuantity: existing.availableQuantity + transaction.quantity,
          avgCostPerShare: newAvgCost,
          totalInvestedAmount: Number(existing.totalInvestedAmount) + newTotalCost,
          totalSharesBought: existing.totalSharesBought + transaction.quantity
        }
      })
    } else {
      await tx.portfolioHolding.create({
        data: {
          symbol: transaction.symbol,
          availableQuantity: transaction.quantity,
          avgCostPerShare: Number(transaction.rate),
          totalInvestedAmount: newTotalCost,
          totalSharesBought: transaction.quantity,
          totalSharesSold: 0,
          totalRealizedPnL: 0
        }
      })
    }
  }

  /**
   * Update portfolio on SELL transaction
   */
  private static async updatePortfolioOnSell(transaction: any, tx: any) {
    const holding = await tx.portfolioHolding.findUnique({
      where: { symbol: transaction.symbol }
    })

    if (!holding) throw new Error('No holding found for symbol')

    // Calculate realized P/L
    const pnLData = InvestmentCalculations.calculateRealizedPnL(
      transaction.quantity,
      Number(transaction.rate),
      Number(holding.avgCostPerShare),
      Number(transaction.totalCharges)
    )

    // Create P/L record
    await tx.realizedPnL.create({
      data: {
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
      }
    })

    // Update portfolio holding
    await tx.portfolioHolding.update({
      where: { symbol: transaction.symbol },
      data: {
        availableQuantity: holding.availableQuantity - transaction.quantity,
        totalSharesSold: holding.totalSharesSold + transaction.quantity,
        totalRealizedPnL: Number(holding.totalRealizedPnL) + pnLData.realizedPnL
      }
    })
  }

  /**
   * Get transactions with optional filtering
   */
  static async getTransactions(query: TransactionQuery) {
    const { symbol, activity, startDate, endDate, page = 1, limit = 50 } = query
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (symbol) where.symbol = symbol.toUpperCase()
    if (activity) where.activity = activity
    if (startDate || endDate) {
      where.transactionDate = {}
      if (startDate) where.transactionDate.gte = new Date(startDate)
      if (endDate) where.transactionDate.lte = new Date(endDate)
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { transactionDate: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.transaction.count({ where })
    ])

    return {
      data: transactions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    }
  }

  /**
   * Get single transaction by ID
   */
  static async getTransactionById(id: string) {
    return await prisma.transaction.findUnique({
      where: { id },
      include: { realizedPnL: true }
    })
  }

  /**
   * Delete transaction and recalculate portfolio
   */
  static async deleteTransaction(id: string) {
    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id },
        include: { realizedPnL: true }
      })

      if (!transaction) throw new Error('Transaction not found')

      // Delete related P/L records
      await tx.realizedPnL.deleteMany({
        where: { transactionId: id }
      })

      // Delete transaction
      await tx.transaction.delete({
        where: { id }
      })

      // Recalculate portfolio for this symbol
      await this.recalculatePortfolio(transaction.symbol, tx)
    })
  }

  /**
   * Recalculate entire portfolio state for a symbol
   */
  private static async recalculatePortfolio(symbol: string, tx: any) {
    // Get all transactions for this symbol in chronological order
    const transactions = await tx.transaction.findMany({
      where: { symbol },
      orderBy: { transactionDate: 'asc' }
    })

    // Reset portfolio holding
    await tx.portfolioHolding.delete({
      where: { symbol }
    }).catch(() => {}) // Ignore if doesn't exist

    // Delete existing P/L records
    await tx.realizedPnL.deleteMany({
      where: { symbol }
    })

    // Replay all transactions
    for (const transaction of transactions) {
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
    const [holdings, totalStats] = await Promise.all([
      prisma.portfolioHolding.findMany({
        orderBy: { symbol: 'asc' }
      }),
      prisma.portfolioHolding.aggregate({
        _sum: {
          totalInvestedAmount: true,
          totalRealizedPnL: true,
          availableQuantity: true
        },
        _count: true
      })
    ])

    // Calculate total recovered from sell transactions
    const sellTransactions = await prisma.transaction.aggregate({
      where: { activity: 'SELL' },
      _sum: { netAmount: true }
    })

    const summary = {
      totalInvested: Number(totalStats._sum.totalInvestedAmount || 0),
      totalRecovered: Number(sellTransactions._sum.netAmount || 0),
      totalRealizedPnL: Number(totalStats._sum.totalRealizedPnL || 0),
      totalHoldings: Number(totalStats._sum.availableQuantity || 0),
      activeScripts: totalStats._count
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
    
    const [holding, transactions, realizedPnL] = await Promise.all([
      prisma.portfolioHolding.findUnique({
        where: { symbol: upperSymbol }
      }),
      prisma.transaction.findMany({
        where: { symbol: upperSymbol },
        orderBy: { transactionDate: 'desc' }
      }),
      prisma.realizedPnL.findMany({
        where: { symbol: upperSymbol },
        orderBy: { sellDate: 'desc' }
      })
    ])

    if (!holding) {
      throw new Error('Script not found in portfolio')
    }

    const details = {
      symbol: holding.symbol,
      availableQuantity: holding.availableQuantity,
      avgCostPerShare: Number(holding.avgCostPerShare),
      totalInvestedAmount: Number(holding.totalInvestedAmount),
      totalRealizedPnL: Number(holding.totalRealizedPnL)
    }

    return {
      details,
      transactions,
      realizedPnL
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
    const where: any = {}
    
    if (filters.symbol) where.symbol = filters.symbol.toUpperCase()
    if (filters.startDate || filters.endDate) {
      where.sellDate = {}
      if (filters.startDate) where.sellDate.gte = new Date(filters.startDate)
      if (filters.endDate) where.sellDate.lte = new Date(filters.endDate)
    }

    return await prisma.realizedPnL.findMany({
      where,
      include: {
        transaction: {
          select: {
            transactionDate: true,
            totalCharges: true
          }
        }
      },
      orderBy: { sellDate: 'desc' }
    })
  }
}
