import { NextResponse } from 'next/server'
import { MockDataService } from '@/lib/services/mock-data'

export async function GET() {
  try {
    const portfolioData = MockDataService.getPortfolio()
    
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
