import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')

    // Get monthly P/L data
    const realizedPnL = await prisma.realizedPnL.findMany({
      where: year ? {
        sellDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`)
        }
      } : undefined,
      orderBy: { sellDate: 'asc' }
    })

    // Group by month
    const monthlyData = realizedPnL.reduce((acc, record) => {
      const date = new Date(record.sellDate)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          monthName: date.toLocaleString('default', { month: 'long' }),
          totalPnL: 0,
          totalTransactions: 0,
          totalProfit: 0,
          totalLoss: 0
        }
      }
      
      acc[monthKey].totalPnL += Number(record.realizedPnL)
      acc[monthKey].totalTransactions += 1
      
      if (Number(record.realizedPnL) > 0) {
        acc[monthKey].totalProfit += Number(record.realizedPnL)
      } else {
        acc[monthKey].totalLoss += Number(record.realizedPnL)
      }
      
      return acc
    }, {} as any)

    const result = Object.values(monthlyData).sort((a: any, b: any) => 
      new Date(`${a.year}-${a.month}`).getTime() - new Date(`${b.year}-${b.month}`).getTime()
    )

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
