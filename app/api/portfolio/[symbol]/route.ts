import { NextRequest, NextResponse } from 'next/server'
import { MockDataService } from '@/lib/services/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const scriptData = MockDataService.getScriptDetails(params.symbol)

    return NextResponse.json({
      success: true,
      data: scriptData
    })
  } catch (error) {
    console.error(`GET /api/portfolio/${params.symbol} error:`, error)
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { 
          success: false,
          error: error.message 
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch script details' 
      },
      { status: 500 }
    )
  }
}
