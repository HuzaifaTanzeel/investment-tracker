/**
 * Investment calculation utilities based on PSX (Pakistan Stock Exchange) rules
 */

export class InvestmentCalculations {
  /**
   * Calculate broker commission based on rate and quantity
   * Rule: IF rate > 33.33: commission = amount × 0.0015
   *       ELSE: commission = quantity × 0.05
   */
  static calculateBrokerCommission(
    rate: number,
    amount: number,
    quantity: number
  ): number {
    if (rate > 33.33) {
      return amount * 0.0015
    } else {
      return quantity * 0.05
    }
  }

  /**
   * Calculate all charges for a transaction
   */
  static calculateCharges(rate: number, amount: number, quantity: number) {
    const commission = this.calculateBrokerCommission(rate, amount, quantity)
    const sst = commission * 0.15 // 15% of commission
    const cdc = quantity * 0.005 // 0.005 per share
    const totalCharges = commission + sst + cdc

    return {
      commission: Number(commission.toFixed(2)),
      sst: Number(sst.toFixed(2)),
      cdc: Number(cdc.toFixed(2)),
      totalCharges: Number(totalCharges.toFixed(2))
    }
  }

  /**
   * Calculate new average cost for portfolio update on BUY
   */
  static calculateNewAverageCost(
    currentQuantity: number,
    currentAvgCost: number,
    newQuantity: number,
    newTotalCost: number
  ): number {
    const currentInvestment = currentQuantity * currentAvgCost
    const totalInvestment = currentInvestment + newTotalCost
    const totalQuantity = currentQuantity + newQuantity
    
    return Number((totalInvestment / totalQuantity).toFixed(4))
  }

  /**
   * Calculate realized P/L for SELL transaction
   */
  static calculateRealizedPnL(
    sellQuantity: number,
    sellRate: number,
    avgCostBasis: number,
    totalCharges: number
  ) {
    const grossProceeds = sellQuantity * sellRate
    const netProceeds = grossProceeds - totalCharges
    const costBasis = sellQuantity * avgCostBasis
    const realizedPnL = netProceeds - costBasis
    const pnLPercentage = (realizedPnL / costBasis) * 100

    return {
      grossProceeds: Number(grossProceeds.toFixed(2)),
      netProceeds: Number(netProceeds.toFixed(2)),
      costBasis: Number(costBasis.toFixed(2)),
      realizedPnL: Number(realizedPnL.toFixed(2)),
      pnLPercentage: Number(pnLPercentage.toFixed(4))
    }
  }

  /**
   * Format currency in PKR
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  /**
   * Format percentage
   */
  static formatPercentage(percentage: number): string {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`
  }

  /**
   * Format large numbers with K, M, B suffixes
   */
  static formatCompactNumber(num: number): string {
    if (Math.abs(num) >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B'
    }
    if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M'
    }
    if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K'
    }
    return num.toFixed(0)
  }

  /**
   * Get profit/loss color class for Tailwind
   */
  static getPnLColorClass(amount: number): string {
    if (amount > 0) return 'text-green-600'
    if (amount < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  /**
   * Get profit/loss background color class for Tailwind
   */
  static getPnLBgColorClass(amount: number): string {
    if (amount > 0) return 'bg-green-50 border-green-200'
    if (amount < 0) return 'bg-red-50 border-red-200'
    return 'bg-gray-50 border-gray-200'
  }
}
