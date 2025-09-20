// Mock data for development - simulates database responses

export interface MockTransaction {
  id: string;
  transactionDate: string;
  symbol: string;
  activity: 'BUY' | 'SELL';
  quantity: number;
  rate: number;
  amount: number;
  commission: number;
  sst: number;
  cdc: number;
  totalCharges: number;
  netAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockPortfolioHolding {
  symbol: string;
  availableQuantity: number;
  avgCostPerShare: number;
  totalInvestedAmount: number;
  totalSharesBought: number;
  totalSharesSold: number;
  totalRealizedPnL: number;
  updatedAt: string;
}

export interface MockRealizedPnL {
  id: string;
  transactionId: string;
  symbol: string;
  sellDate: string;
  quantitySold: number;
  sellRate: number;
  avgCostBasis: number;
  grossProceeds: number;
  netProceeds: number;
  costBasis: number;
  realizedPnL: number;
  pnLPercentage: number;
  createdAt: string;
}

// Mock data storage
let mockTransactions: MockTransaction[] = [
  {
    id: '1',
    transactionDate: '2024-01-15T00:00:00.000Z',
    symbol: 'TRG',
    activity: 'BUY',
    quantity: 100,
    rate: 85.50,
    amount: 8550.00,
    commission: 128.25,
    sst: 19.24,
    cdc: 42.75,
    totalCharges: 190.24,
    netAmount: 8740.24,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    transactionDate: '2024-01-20T00:00:00.000Z',
    symbol: 'TRG',
    activity: 'SELL',
    quantity: 50,
    rate: 92.00,
    amount: 4600.00,
    commission: 69.00,
    sst: 10.35,
    cdc: 23.00,
    totalCharges: 102.35,
    netAmount: 4497.65,
    createdAt: '2024-01-20T11:00:00.000Z',
    updatedAt: '2024-01-20T11:00:00.000Z'
  },
  {
    id: '3',
    transactionDate: '2024-02-01T00:00:00.000Z',
    symbol: 'OGDC',
    activity: 'BUY',
    quantity: 200,
    rate: 45.25,
    amount: 9050.00,
    commission: 136.50,
    sst: 20.48,
    cdc: 45.25,
    totalCharges: 202.23,
    netAmount: 9252.23,
    createdAt: '2024-02-01T09:30:00.000Z',
    updatedAt: '2024-02-01T09:30:00.000Z'
  },
  {
    id: '4',
    transactionDate: '2024-02-15T00:00:00.000Z',
    symbol: 'OGDC',
    activity: 'SELL',
    quantity: 100,
    rate: 48.50,
    amount: 4850.00,
    commission: 72.75,
    sst: 10.91,
    cdc: 24.25,
    totalCharges: 107.91,
    netAmount: 4742.09,
    createdAt: '2024-02-15T14:15:00.000Z',
    updatedAt: '2024-02-15T14:15:00.000Z'
  }
];

let mockHoldings: MockPortfolioHolding[] = [
  {
    symbol: 'TRG',
    availableQuantity: 50,
    avgCostPerShare: 85.50,
    totalInvestedAmount: 4370.12,
    totalSharesBought: 100,
    totalSharesSold: 50,
    totalRealizedPnL: 272.65,
    updatedAt: '2024-01-20T11:00:00.000Z'
  },
  {
    symbol: 'OGDC',
    availableQuantity: 100,
    avgCostPerShare: 45.25,
    totalInvestedAmount: 4626.12,
    totalSharesBought: 200,
    totalSharesSold: 100,
    totalRealizedPnL: 115.84,
    updatedAt: '2024-02-15T14:15:00.000Z'
  }
];

let mockRealizedPnL: MockRealizedPnL[] = [
  {
    id: 'pnl1',
    transactionId: '2',
    symbol: 'TRG',
    sellDate: '2024-01-20T00:00:00.000Z',
    quantitySold: 50,
    sellRate: 92.00,
    avgCostBasis: 85.50,
    grossProceeds: 4600.00,
    netProceeds: 4497.65,
    costBasis: 4275.00,
    realizedPnL: 222.65,
    pnLPercentage: 5.21,
    createdAt: '2024-01-20T11:00:00.000Z'
  },
  {
    id: 'pnl2',
    transactionId: '4',
    symbol: 'OGDC',
    sellDate: '2024-02-15T00:00:00.000Z',
    quantitySold: 100,
    sellRate: 48.50,
    avgCostBasis: 45.25,
    grossProceeds: 4850.00,
    netProceeds: 4742.09,
    costBasis: 4525.00,
    realizedPnL: 217.09,
    pnLPercentage: 4.80,
    createdAt: '2024-02-15T14:15:00.000Z'
  }
];

export class MockDataService {
  // Transaction operations
  static getTransactions(query: any = {}) {
    let filtered = [...mockTransactions];
    
    if (query.symbol) {
      filtered = filtered.filter(t => t.symbol === query.symbol.toUpperCase());
    }
    
    if (query.activity) {
      filtered = filtered.filter(t => t.activity === query.activity);
    }
    
    if (query.startDate) {
      filtered = filtered.filter(t => new Date(t.transactionDate) >= new Date(query.startDate));
    }
    
    if (query.endDate) {
      filtered = filtered.filter(t => new Date(t.transactionDate) <= new Date(query.endDate));
    }
    
    // Sort by date descending
    filtered.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
    
    const page = query.page || 1;
    const limit = query.limit || 50;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      pagination: {
        total: filtered.length,
        page,
        limit,
        pages: Math.ceil(filtered.length / limit)
      }
    };
  }
  
  static getTransactionById(id: string) {
    return mockTransactions.find(t => t.id === id) || null;
  }
  
  static createTransaction(data: any) {
    const newId = (mockTransactions.length + 1).toString();
    const amount = data.quantity * data.rate;
    
    // Calculate charges using the existing calculation logic
    const charges = this.calculateCharges(data.rate, amount, data.quantity);
    
    const newTransaction: MockTransaction = {
      id: newId,
      transactionDate: new Date(data.transactionDate).toISOString(),
      symbol: data.symbol.toUpperCase(),
      activity: data.activity,
      quantity: data.quantity,
      rate: data.rate,
      amount,
      ...charges,
      netAmount: data.activity === 'BUY' 
        ? amount + charges.totalCharges 
        : amount - charges.totalCharges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockTransactions.push(newTransaction);
    
    // Update portfolio holdings
    this.updatePortfolio(newTransaction);
    
    return newTransaction;
  }
  
  static deleteTransaction(id: string) {
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTransactions.splice(index, 1);
      // In a real app, you'd recalculate portfolio here
      return true;
    }
    return false;
  }
  
  // Portfolio operations
  static getPortfolio() {
    const totalInvested = mockHoldings.reduce((sum, h) => sum + h.totalInvestedAmount, 0);
    const totalRealizedPnL = mockHoldings.reduce((sum, h) => sum + h.totalRealizedPnL, 0);
    const totalRecovered = mockTransactions
      .filter(t => t.activity === 'SELL')
      .reduce((sum, t) => sum + t.netAmount, 0);
    const totalHoldings = mockHoldings.reduce((sum, h) => sum + h.availableQuantity, 0);
    
    return {
      holdings: mockHoldings,
      summary: {
        totalInvested,
        totalRecovered,
        totalRealizedPnL,
        totalHoldings,
        activeScripts: mockHoldings.length
      }
    };
  }
  
  static getScriptDetails(symbol: string) {
    const upperSymbol = symbol.toUpperCase();
    const holding = mockHoldings.find(h => h.symbol === upperSymbol);
    
    if (!holding) {
      throw new Error('Script not found in portfolio');
    }
    
    const transactions = mockTransactions.filter(t => t.symbol === upperSymbol);
    const realizedPnL = mockRealizedPnL.filter(p => p.symbol === upperSymbol);
    
    return {
      details: {
        symbol: holding.symbol,
        availableQuantity: holding.availableQuantity,
        avgCostPerShare: holding.avgCostPerShare,
        totalInvestedAmount: holding.totalInvestedAmount,
        totalRealizedPnL: holding.totalRealizedPnL
      },
      transactions,
      realizedPnL
    };
  }
  
  // Reports
  static getRealizedPnL(filters: any = {}) {
    let filtered = [...mockRealizedPnL];
    
    if (filters.symbol) {
      filtered = filtered.filter(p => p.symbol === filters.symbol.toUpperCase());
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(p => new Date(p.sellDate) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(p => new Date(p.sellDate) <= new Date(filters.endDate));
    }
    
    return filtered.sort((a, b) => new Date(b.sellDate).getTime() - new Date(a.sellDate).getTime());
  }
  
  static getMonthlyPnL(year?: number) {
    const pnlData = this.getRealizedPnL();
    
    const monthlyData = pnlData.reduce((acc, record) => {
      const date = new Date(record.sellDate);
      if (year && date.getFullYear() !== year) return acc;
      
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          monthName: date.toLocaleString('default', { month: 'long' }),
          totalPnL: 0,
          totalTransactions: 0,
          totalProfit: 0,
          totalLoss: 0
        };
      }
      
      acc[monthKey].totalPnL += record.realizedPnL;
      acc[monthKey].totalTransactions += 1;
      
      if (record.realizedPnL > 0) {
        acc[monthKey].totalProfit += record.realizedPnL;
      } else {
        acc[monthKey].totalLoss += record.realizedPnL;
      }
      
      return acc;
    }, {} as any);
    
    return Object.values(monthlyData).sort((a: any, b: any) => 
      new Date(`${a.year}-${a.month}`).getTime() - new Date(`${b.year}-${b.month}`).getTime()
    );
  }
  
  static getScriptWisePnL() {
    return mockHoldings.map(holding => {
      const buyTransactions = mockTransactions.filter(t => 
        t.symbol === holding.symbol && t.activity === 'BUY'
      );
      const sellTransactions = mockTransactions.filter(t => 
        t.symbol === holding.symbol && t.activity === 'SELL'
      );
      
      const totalQuantityTraded = holding.totalSharesBought + holding.totalSharesSold;
      const totalRecovered = sellTransactions.reduce((sum, t) => sum + t.netAmount, 0);
      const avgBuyRate = buyTransactions.length > 0 
        ? buyTransactions.reduce((sum, t) => sum + t.rate, 0) / buyTransactions.length 
        : 0;
      const avgSellRate = sellTransactions.length > 0 
        ? sellTransactions.reduce((sum, t) => sum + t.rate, 0) / sellTransactions.length 
        : 0;
      
      return {
        symbol: holding.symbol,
        totalPnL: holding.totalRealizedPnL,
        totalQuantityTraded,
        totalInvested: holding.totalInvestedAmount,
        totalRecovered,
        avgBuyRate,
        avgSellRate,
        availableQuantity: holding.availableQuantity,
        currentAvgCost: holding.avgCostPerShare
      };
    });
  }
  
  // Helper methods
  private static calculateCharges(rate: number, amount: number, quantity: number) {
    const commission = rate > 33.33 ? amount * 0.0015 : quantity * 0.05;
    const sst = commission * 0.15;
    const cdc = quantity * 0.005;
    const totalCharges = commission + sst + cdc;
    
    return {
      commission: Number(commission.toFixed(2)),
      sst: Number(sst.toFixed(2)),
      cdc: Number(cdc.toFixed(2)),
      totalCharges: Number(totalCharges.toFixed(2))
    };
  }
  
  private static updatePortfolio(transaction: MockTransaction) {
    // This is a simplified portfolio update for mock data
    // In a real application, this would be more sophisticated
    console.log('Portfolio updated for transaction:', transaction.id);
  }
}
