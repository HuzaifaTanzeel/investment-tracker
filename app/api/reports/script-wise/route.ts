import { NextResponse } from 'next/server'
import { MockDataService } from '@/lib/services/mock-data'

export async function GET() {
  try {
    const scriptStats = MockDataService.getScriptWisePnL()

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
