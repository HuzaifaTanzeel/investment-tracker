import { NextRequest, NextResponse } from 'next/server'
import { MockDataService } from '@/lib/services/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = MockDataService.getTransactionById(params.id)

    if (!transaction) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Transaction not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: transaction
    })
  } catch (error) {
    console.error(`GET /api/transactions/${params.id} error:`, error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch transaction' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = MockDataService.deleteTransaction(params.id)
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Transaction not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Transaction deleted successfully' 
    })
  } catch (error) {
    console.error(`DELETE /api/transactions/${params.id} error:`, error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete transaction' 
      },
      { status: 400 }
    )
  }
}
