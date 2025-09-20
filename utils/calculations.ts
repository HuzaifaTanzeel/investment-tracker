import { PSX_CHARGES, Transaction } from '@/types';

/**
 * Calculate PSX transaction charges
 */
export function calculateCharges(quantity: number, rate: number): {
  commission: number;
  sst: number;
  cdc: number;
  totalCharges: number;
} {
  const grossValue = quantity * rate;
  
  // Commission calculation (minimum PKR 20)
  const commission = Math.max(
    grossValue * PSX_CHARGES.COMMISSION_RATE,
    PSX_CHARGES.MIN_COMMISSION
  );
  
  // SST on commission
  const sst = commission * PSX_CHARGES.SST_RATE;
  
  // CDC charges
  const cdc = grossValue * PSX_CHARGES.CDC_RATE;
  
  const totalCharges = commission + sst + cdc;
  
  return {
    commission: parseFloat(commission.toFixed(2)),
    sst: parseFloat(sst.toFixed(2)),
    cdc: parseFloat(cdc.toFixed(2)),
    totalCharges: parseFloat(totalCharges.toFixed(2)),
  };
}

/**
 * Calculate net amount for transaction
 */
export function calculateNetAmount(
  quantity: number, 
  rate: number, 
  type: 'BUY' | 'SELL'
): number {
  const grossValue = quantity * rate;
  const { totalCharges } = calculateCharges(quantity, rate);
  
  // For BUY: add charges to gross value
  // For SELL: subtract charges from gross value
  const netAmount = type === 'BUY' 
    ? grossValue + totalCharges 
    : grossValue - totalCharges;
  
  return parseFloat(netAmount.toFixed(2));
}

/**
 * Calculate average cost for holdings
 */
export function calculateAverageCost(transactions: Transaction[], symbol: string): {
  quantity: number;
  avgCost: number;
  totalInvested: number;
} {
  const symbolTransactions = transactions.filter(t => t.symbol === symbol);
  
  let totalShares = 0;
  let totalInvested = 0;
  
  for (const transaction of symbolTransactions) {
    if (transaction.type === 'BUY') {
      totalShares += transaction.quantity;
      totalInvested += transaction.netAmount;
    } else {
      totalShares -= transaction.quantity;
      // For sell transactions, reduce invested amount proportionally
      const sellRatio = transaction.quantity / (totalShares + transaction.quantity);
      totalInvested *= (1 - sellRatio);
    }
  }
  
  const avgCost = totalShares > 0 ? totalInvested / totalShares : 0;
  
  return {
    quantity: totalShares,
    avgCost: parseFloat(avgCost.toFixed(4)),
    totalInvested: parseFloat(totalInvested.toFixed(2)),
  };
}

/**
 * Calculate realized P&L for a sell transaction
 */
export function calculateRealizedPnL(
  sellTransaction: Transaction,
  avgBuyRate: number
): {
  profitLoss: number;
  profitLossPercentage: number;
} {
  const sellValue = sellTransaction.quantity * sellTransaction.rate;
  const buyValue = sellTransaction.quantity * avgBuyRate;
  
  // P&L = (Sell Value - Sell Charges) - Buy Value
  const profitLoss = (sellValue - sellTransaction.totalCharges) - buyValue;
  const profitLossPercentage = buyValue > 0 ? (profitLoss / buyValue) * 100 : 0;
  
  return {
    profitLoss: parseFloat(profitLoss.toFixed(2)),
    profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2)),
  };
}

/**
 * Format currency in PKR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(percentage: number): string {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(num: number): string {
  if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toFixed(0);
}

/**
 * Get profit/loss color class for Tailwind
 */
export function getPnLColorClass(amount: number): string {
  if (amount > 0) return 'text-green-600';
  if (amount < 0) return 'text-red-600';
  return 'text-gray-600';
}

/**
 * Get profit/loss background color class for Tailwind
 */
export function getPnLBgColorClass(amount: number): string {
  if (amount > 0) return 'bg-green-50 border-green-200';
  if (amount < 0) return 'bg-red-50 border-red-200';
  return 'bg-gray-50 border-gray-200';
}
