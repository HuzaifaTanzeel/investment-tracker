import { NextRequest, NextResponse } from 'next/server'
import { DrizzleTransactionService } from '@/lib/services/drizzle-transaction-service'
import { TransactionCreateSchema, TransactionQuerySchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams)
    
    const validatedQuery = TransactionQuerySchema.parse(query)
    const result = await DrizzleTransactionService.getTransactions(validatedQuery)
    
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
    
    const transaction = await DrizzleTransactionService.createTransaction(validatedInput)
    
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
