'use client';

import { formatCurrency, getPnLColorClass } from '@/utils/calculations';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mock data - will be replaced with real API data
const mockRealizedPnL = [
  {
    id: '1',
    sellTransactionId: 'sell-1',
    symbol: 'TRG',
    sellDate: '2024-12-19',
    quantitySold: 500,
    sellRate: 47.25,
    avgBuyRate: 45.50,
    profitLoss: 875,
    profitLossPercentage: 3.85,
    sellCharges: 441,
  },
  {
    id: '2',
    sellTransactionId: 'sell-2',
    symbol: 'OGDC',
    sellDate: '2024-12-15',
    quantitySold: 500,
    sellRate: 85.25,
    avgBuyRate: 82.00,
    profitLoss: 1625,
    profitLossPercentage: 3.96,
    sellCharges: 639,
  },
  {
    id: '3',
    sellTransactionId: 'sell-3',
    symbol: 'LUCK',
    sellDate: '2024-12-10',
    quantitySold: 200,
    sellRate: 680.00,
    avgBuyRate: 650.00,
    profitLoss: 6000,
    profitLossPercentage: 4.62,
    sellCharges: 272,
  },
  {
    id: '4',
    sellTransactionId: 'sell-4',
    symbol: 'UBL',
    sellDate: '2024-11-28',
    quantitySold: 100,
    sellRate: 170.00,
    avgBuyRate: 175.50,
    profitLoss: -550,
    profitLossPercentage: -3.13,
    sellCharges: 255,
  },
];

interface RealizedPnLTableProps {
  symbol?: string;
  limit?: number;
}

export default function RealizedPnLTable({ symbol, limit }: RealizedPnLTableProps) {
  let realizedPnL = mockRealizedPnL;
  
  // Filter by symbol if provided
  if (symbol) {
    realizedPnL = realizedPnL.filter(item => item.symbol === symbol);
  }
  
  // Apply limit if provided
  if (limit) {
    realizedPnL = realizedPnL.slice(0, limit);
  }

  const totalRealizedPnL = realizedPnL.reduce((sum, item) => sum + item.profitLoss, 0);
  const totalCharges = realizedPnL.reduce((sum, item) => sum + item.sellCharges, 0);

  if (realizedPnL.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No realized P&L transactions found</p>
        <p className="text-sm text-gray-400 mt-1">Sell some shares to see realized P&L</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Row */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Realized P&L</p>
            <p className={`font-semibold ${getPnLColorClass(totalRealizedPnL)}`}>
              {formatCurrency(totalRealizedPnL)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Sell Charges</p>
            <p className="font-semibold text-red-600">
              {formatCurrency(totalCharges)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Realized P&L</p>
            <p className={`font-semibold ${getPnLColorClass(totalRealizedPnL - totalCharges)}`}>
              {formatCurrency(totalRealizedPnL - totalCharges)}
            </p>
          </div>
        </div>
      </div>

      {/* Realized P&L Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sell Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sell Rate
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Buy Rate
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                P&L
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                P&L %
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charges
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {realizedPnL.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(item.sellDate), 'dd/MM/yyyy')}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{item.symbol}</span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                  {item.quantitySold.toLocaleString()}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                  {formatCurrency(item.sellRate)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                  {formatCurrency(item.avgBuyRate)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {item.profitLoss >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium font-mono ${getPnLColorClass(item.profitLoss)}`}>
                      {formatCurrency(item.profitLoss)}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`text-sm font-medium ${getPnLColorClass(item.profitLoss)}`}>
                    {item.profitLossPercentage >= 0 ? '+' : ''}{item.profitLossPercentage.toFixed(2)}%
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-mono">
                  {formatCurrency(item.sellCharges)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
