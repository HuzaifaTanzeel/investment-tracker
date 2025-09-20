import AppLayout from '@/components/layout/AppLayout';
import { formatCurrency, getPnLColorClass } from '@/utils/calculations';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

// Mock data - will be replaced with real API data
const mockMonthlyData = [
  { month: 'December 2024', pnl: 8500, transactions: 12, charges: 450 },
  { month: 'November 2024', pnl: 6200, transactions: 8, charges: 320 },
  { month: 'October 2024', pnl: -2100, transactions: 6, charges: 250 },
  { month: 'September 2024', pnl: 15600, transactions: 15, charges: 680 },
  { month: 'August 2024', pnl: 4300, transactions: 9, charges: 380 },
  { month: 'July 2024', pnl: -800, transactions: 4, charges: 180 },
];

export default function MonthlyReportsPage() {
  const monthlyData = mockMonthlyData;
  const totalPnL = monthlyData.reduce((sum, month) => sum + month.pnl, 0);
  const totalTransactions = monthlyData.reduce((sum, month) => sum + month.transactions, 0);
  const totalCharges = monthlyData.reduce((sum, month) => sum + month.charges, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monthly Reports</h1>
            <p className="mt-2 text-gray-600">Month-wise profit & loss breakdown</p>
          </div>
          
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total P&L (6 months)</p>
                <p className={`text-2xl font-bold ${getPnLColorClass(totalPnL)}`}>
                  {formatCurrency(totalPnL)}
                </p>
              </div>
              {totalPnL >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Charges</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCharges)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Monthly Breakdown Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Breakdown</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Charges
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net P&L
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyData.map((month, index) => {
                  const netPnL = month.pnl - month.charges;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {month.pnl >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium font-mono ${getPnLColorClass(month.pnl)}`}>
                            {formatCurrency(month.pnl)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                        {month.transactions}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-mono">
                        {formatCurrency(month.charges)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold font-mono ${getPnLColorClass(netPnL)}`}>
                          {formatCurrency(netPnL)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
