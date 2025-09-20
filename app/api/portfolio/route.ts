import { NextResponse } from 'next/server'
import { DrizzleTransactionService } from '@/lib/services/drizzle-transaction-service'

export async function GET() {
  try {
    const portfolioData = await DrizzleTransactionService.getPortfolioSummary()
    
    return NextResponse.json({
      success: true,
      data: portfolioData
    })
  } catch (error) {
    console.error('GET /api/portfolio error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch portfolio data' 
      },
      { status: 500 }
    )
  }
}
