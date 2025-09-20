'use client';

import { formatCurrency, getPnLColorClass } from '@/utils/calculations';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock data - will be replaced with real API data
const mockTransactions = [
  {
    id: '1',
    date: '2024-12-20',
    type: 'BUY' as const,
    symbol: 'TRG',
    quantity: 1000,
    rate: 45.50,
    netAmount: 45750,
  },
  {
    id: '2',
    date: '2024-12-19',
    type: 'SELL' as const,
    symbol: 'OGDC',
    quantity: 500,
    rate: 85.25,
    netAmount: 42400,
  },
  {
    id: '3',
    date: '2024-12-18',
    type: 'BUY' as const,
    symbol: 'LUCK',
    quantity: 500,
    rate: 650.00,
    netAmount: 325800,
  },
  {
    id: '4',
    date: '2024-12-17',
    type: 'SELL' as const,
    symbol: 'TRG',
    quantity: 500,
    rate: 47.25,
    netAmount: 23400,
  },
  {
    id: '5',
    date: '2024-12-16',
    type: 'BUY' as const,
    symbol: 'UBL',
    quantity: 200,
    rate: 175.50,
    netAmount: 35150,
  },
];

interface RecentTransactionsProps {
  limit?: number;
}

export default function RecentTransactions({ limit = 5 }: RecentTransactionsProps) {
  const transactions = mockTransactions.slice(0, limit);

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No transactions found</p>
        <p className="text-sm text-gray-400 mt-1">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rate
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Net Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(transaction.date), 'dd/MM/yyyy')}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {transaction.type === 'BUY' ? (
                    <>
                      <ArrowDownRight className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-600">BUY</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-red-600">SELL</span>
                    </>
                  )}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{transaction.symbol}</span>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                {transaction.quantity.toLocaleString()}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                {formatCurrency(transaction.rate)}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono">
                <span className={transaction.type === 'BUY' ? 'text-red-600' : 'text-green-600'}>
                  {transaction.type === 'BUY' ? '-' : '+'}
                  {formatCurrency(transaction.netAmount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
