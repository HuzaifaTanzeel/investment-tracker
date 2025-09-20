import { NextRequest, NextResponse } from 'next/server'
import { MockDataService } from '@/lib/services/mock-data'
import { TransactionCreateSchema, TransactionQuerySchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams)
    
    const validatedQuery = TransactionQuerySchema.parse(query)
    const result = MockDataService.getTransactions(validatedQuery)
    
    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('GET /api/transactions error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch transactions' 
      },
      { status: 400 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedInput = TransactionCreateSchema.parse(body)
    
    const transaction = MockDataService.createTransaction(validatedInput)
    
    return NextResponse.json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/transactions error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create transaction' 
      },
      { status: 400 }
    )
  }
}
