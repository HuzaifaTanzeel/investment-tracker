import { db } from '../db'
import { transactions, portfolioHoldings, realizedPnL } from './schema'

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...')

    // Clear existing data
    await db.delete(realizedPnL)
    await db.delete(portfolioHoldings)
    await db.delete(transactions)

    // Insert sample transactions
    const sampleTransactions = [
      {
        transactionDate: new Date('2024-01-15'),
        symbol: 'TRG',
        activity: 'BUY' as const,
        quantity: 100,
        rate: 85.50,
        amount: 8550.00,
        commission: 128.25,
        sst: 19.24,
        cdc: 42.75,
        totalCharges: 190.24,
        netAmount: 8740.24,
        updatedAt: new Date()
      },
      {
        transactionDate: new Date('2024-01-20'),
        symbol: 'TRG',
        activity: 'SELL' as const,
        quantity: 50,
        rate: 92.00,
        amount: 4600.00,
        commission: 69.00,
        sst: 10.35,
        cdc: 23.00,
        totalCharges: 102.35,
        netAmount: 4497.65,
        updatedAt: new Date()
      },
      {
        transactionDate: new Date('2024-02-01'),
        symbol: 'OGDC',
        activity: 'BUY' as const,
        quantity: 200,
        rate: 45.25,
        amount: 9050.00,
        commission: 136.50,
        sst: 20.48,
        cdc: 45.25,
        totalCharges: 202.23,
        netAmount: 9252.23,
        updatedAt: new Date()
      },
      {
        transactionDate: new Date('2024-02-15'),
        symbol: 'OGDC',
        activity: 'SELL' as const,
        quantity: 100,
        rate: 48.50,
        amount: 4850.00,
        commission: 72.75,
        sst: 10.91,
        cdc: 24.25,
        totalCharges: 107.91,
        netAmount: 4742.09,
        updatedAt: new Date()
      }
    ]

    const insertedTransactions = await db.insert(transactions).values(sampleTransactions).returning()
    console.log(`✅ Inserted ${insertedTransactions.length} transactions`)

    // Insert portfolio holdings
    const sampleHoldings = [
      {
        symbol: 'TRG',
        availableQuantity: 50,
        avgCostPerShare: 85.50,
        totalInvestedAmount: 4370.12,
        totalSharesBought: 100,
        totalSharesSold: 50,
        totalRealizedPnL: 272.65,
        updatedAt: new Date()
      },
      {
        symbol: 'OGDC',
        availableQuantity: 100,
        avgCostPerShare: 45.25,
        totalInvestedAmount: 4626.12,
        totalSharesBought: 200,
        totalSharesSold: 100,
        totalRealizedPnL: 115.84,
        updatedAt: new Date()
      }
    ]

    const insertedHoldings = await db.insert(portfolioHoldings).values(sampleHoldings).returning()
    console.log(`✅ Inserted ${insertedHoldings.length} portfolio holdings`)

    // Insert realized P&L records
    const samplePnL = [
      {
        transactionId: insertedTransactions[1].id, // TRG SELL
        symbol: 'TRG',
        sellDate: new Date('2024-01-20'),
        quantitySold: 50,
        sellRate: 92.00,
        avgCostBasis: 85.50,
        grossProceeds: 4600.00,
        netProceeds: 4497.65,
        costBasis: 4275.00,
        realizedPnL: 222.65,
        pnLPercentage: 5.21
      },
      {
        transactionId: insertedTransactions[3].id, // OGDC SELL
        symbol: 'OGDC',
        sellDate: new Date('2024-02-15'),
        quantitySold: 100,
        sellRate: 48.50,
        avgCostBasis: 45.25,
        grossProceeds: 4850.00,
        netProceeds: 4742.09,
        costBasis: 4525.00,
        realizedPnL: 217.09,
        pnLPercentage: 4.80
      }
    ]

    const insertedPnL = await db.insert(realizedPnL).values(samplePnL).returning()
    console.log(`✅ Inserted ${insertedPnL.length} realized P&L records`)

    console.log('🎉 Database seeded successfully!')
    
    return {
      transactions: insertedTransactions.length,
      holdings: insertedHoldings.length,
      realizedPnL: insertedPnL.length
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}
