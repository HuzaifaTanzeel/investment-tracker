import { NextRequest, NextResponse } from 'next/server'
import { DrizzleTransactionService } from '@/lib/services/drizzle-transaction-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const filters = {
      symbol: symbol || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    }

    const realizedPnL = await DrizzleTransactionService.getRealizedPnL(filters)

    return NextResponse.json({
      success: true,
      data: realizedPnL
    })
  } catch (error) {
    console.error('GET /api/reports/realized-pnl error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch realized P/L data' 
      },
      { status: 500 }
    )
  }
}
