import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get portfolio holdings with additional calculations
    const holdings = await prisma.portfolioHolding.findMany({
      orderBy: { symbol: 'asc' }
    })

    // Get buy/sell statistics for each symbol
    const scriptStats = await Promise.all(
      holdings.map(async (holding) => {
        const [buyStats, sellStats] = await Promise.all([
          prisma.transaction.aggregate({
            where: { 
              symbol: holding.symbol,
              activity: 'BUY'
            },
            _sum: { quantity: true, netAmount: true },
            _avg: { rate: true }
          }),
          prisma.transaction.aggregate({
            where: { 
              symbol: holding.symbol,
              activity: 'SELL'
            },
            _sum: { quantity: true, netAmount: true },
            _avg: { rate: true }
          })
        ])

        return {
          symbol: holding.symbol,
          totalPnL: Number(holding.totalRealizedPnL),
          totalQuantityTraded: (buyStats._sum.quantity || 0) + (sellStats._sum.quantity || 0),
          totalInvested: Number(holding.totalInvestedAmount),
          totalRecovered: Number(sellStats._sum.netAmount || 0),
          avgBuyRate: Number(buyStats._avg.rate || 0),
          avgSellRate: Number(sellStats._avg.rate || 0),
          availableQuantity: holding.availableQuantity,
          currentAvgCost: Number(holding.avgCostPerShare)
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: scriptStats
    })
  } catch (error) {
    console.error('GET /api/reports/script-wise error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch script-wise P/L data' 
      },
      { status: 500 }
    )
  }
}
