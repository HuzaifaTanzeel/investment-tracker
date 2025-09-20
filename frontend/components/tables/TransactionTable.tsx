'use client';

import { useState } from 'react';
import { formatCurrency } from '@/utils/calculations';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';

// Mock data - will be replaced with real API data
const mockTransactions = [
  {
    id: '1',
    date: '2024-12-20',
    type: 'BUY' as const,
    symbol: 'TRG',
    quantity: 1000,
    rate: 45.50,
    commission: 683,
    sst: 109,
    cdc: 91,
    totalCharges: 883,
    netAmount: 45750,
  },
  {
    id: '2',
    date: '2024-12-19',
    type: 'SELL' as const,
    symbol: 'OGDC',
    quantity: 500,
    rate: 85.25,
    commission: 639,
    sst: 102,
    cdc: 85,
    totalCharges: 826,
    netAmount: 42400,
  },
  // Add more mock transactions...
];

export default function TransactionTable() {
  const [transactions] = useState(mockTransactions);

  const handleEdit = (id: string) => {
    console.log('Edit transaction:', id);
    // Will implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log('Delete transaction:', id);
    // Will implement delete functionality with confirmation
  };

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
              Charges
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Net Amount
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
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
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 font-mono">
                {formatCurrency(transaction.totalCharges)}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono">
                <span className={transaction.type === 'BUY' ? 'text-red-600' : 'text-green-600'}>
                  {transaction.type === 'BUY' ? '-' : '+'}
                  {formatCurrency(transaction.netAmount)}
                </span>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(transaction.id)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Transaction"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
