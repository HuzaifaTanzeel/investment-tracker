import { NextRequest, NextResponse } from 'next/server'
import { MockDataService } from '@/lib/services/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')

    const result = MockDataService.getMonthlyPnL(year ? parseInt(year) : undefined)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('GET /api/reports/monthly error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch monthly P/L data' 
      },
      { status: 500 }
    )
  }
}
