import AppLayout from '@/components/layout/AppLayout';
import { formatCurrency, getPnLColorClass } from '@/utils/calculations';
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

// Mock data - will be replaced with real API data
const mockYearlyData = [
  {
    year: 2024,
    totalPnL: 45000,
    totalTransactions: 89,
    totalCharges: 3200,
    monthlyBreakdown: [
      { month: 12, monthName: 'Dec', pnl: 8500, transactions: 12 },
      { month: 11, monthName: 'Nov', pnl: 6200, transactions: 8 },
      { month: 10, monthName: 'Oct', pnl: -2100, transactions: 6 },
      { month: 9, monthName: 'Sep', pnl: 15600, transactions: 15 },
      { month: 8, monthName: 'Aug', pnl: 4300, transactions: 9 },
      { month: 7, monthName: 'Jul', pnl: -800, transactions: 4 },
      { month: 6, monthName: 'Jun', pnl: 9200, transactions: 11 },
      { month: 5, monthName: 'May', pnl: 1800, transactions: 7 },
      { month: 4, monthName: 'Apr', pnl: 5600, transactions: 10 },
      { month: 3, monthName: 'Mar', pnl: -1200, transactions: 5 },
      { month: 2, monthName: 'Feb', pnl: 3200, transactions: 6 },
      { month: 1, monthName: 'Jan', pnl: 1200, transactions: 2 },
    ],
  },
  {
    year: 2023,
    totalPnL: 28000,
    totalTransactions: 45,
    totalCharges: 1800,
    monthlyBreakdown: [
      { month: 12, monthName: 'Dec', pnl: 5200, transactions: 8 },
      { month: 11, monthName: 'Nov', pnl: 3800, transactions: 6 },
      { month: 10, monthName: 'Oct', pnl: 1200, transactions: 4 },
      { month: 9, monthName: 'Sep', pnl: 8900, transactions: 12 },
      { month: 8, monthName: 'Aug', pnl: 2100, transactions: 5 },
      { month: 7, monthName: 'Jul', pnl: -500, transactions: 3 },
      { month: 6, monthName: 'Jun', pnl: 4500, transactions: 7 },
    ],
  },
];

export default function YearlyReportsPage() {
  const yearlyData = mockYearlyData;
  const currentYear = yearlyData[0];
  const previousYear = yearlyData[1];
  
  const yearOverYearChange = currentYear.totalPnL - previousYear.totalPnL;
  const yearOverYearPercentage = previousYear.totalPnL !== 0 
    ? (yearOverYearChange / Math.abs(previousYear.totalPnL)) * 100 
    : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yearly Reports</h1>
            <p className="mt-2 text-gray-600">Annual profit & loss analysis and trends</p>
          </div>
          
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
        </div>

        {/* Year Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total P&L (2024)</p>
                <p className={`text-2xl font-bold ${getPnLColorClass(currentYear.totalPnL)}`}>
                  {formatCurrency(currentYear.totalPnL)}
                </p>
              </div>
              {currentYear.totalPnL >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">vs 2023</p>
                <p className={`text-2xl font-bold ${getPnLColorClass(yearOverYearChange)}`}>
                  {formatCurrency(Math.abs(yearOverYearChange))}
                </p>
                <p className={`text-sm ${getPnLColorClass(yearOverYearChange)}`}>
                  {yearOverYearPercentage >= 0 ? '+' : ''}{yearOverYearPercentage.toFixed(1)}%
                </p>
              </div>
              {yearOverYearChange >= 0 ? (
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
                <p className="text-2xl font-bold text-gray-900">{currentYear.totalTransactions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Charges</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(currentYear.totalCharges)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Monthly Breakdown Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Performance (2024)</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">P&L</button>
              <button className="px-3 py-1 text-gray-600 rounded-md text-sm">Transactions</button>
            </div>
          </div>
          
          {/* Simple Bar Chart Representation */}
          <div className="space-y-2">
            {currentYear.monthlyBreakdown.map((month) => (
              <div key={month.month} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">
                  {month.monthName}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className={`h-6 rounded-full flex items-center justify-end pr-2 ${
                      month.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(Math.abs(month.pnl) / 20000 * 100, 100)}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(month.pnl)}
                    </span>
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-gray-600">
                  {month.transactions} trades
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Year Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Year Comparison</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total P&L
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Monthly P&L
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yearlyData.map((year) => {
                  const netPnL = year.totalPnL - year.totalCharges;
                  const avgMonthlyPnL = year.totalPnL / 12;
                  
                  return (
                    <tr key={year.year} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {year.year}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {year.totalPnL >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium font-mono ${getPnLColorClass(year.totalPnL)}`}>
                            {formatCurrency(year.totalPnL)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                        {year.totalTransactions}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-mono">
                        {formatCurrency(year.totalCharges)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold font-mono ${getPnLColorClass(netPnL)}`}>
                          {formatCurrency(netPnL)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-medium font-mono ${getPnLColorClass(avgMonthlyPnL)}`}>
                          {formatCurrency(avgMonthlyPnL)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800">
                <strong>Best Month:</strong> September 2024 with {formatCurrency(15600)} profit
              </p>
              <p className="text-blue-800">
                <strong>Worst Month:</strong> October 2024 with {formatCurrency(-2100)} loss
              </p>
            </div>
            <div>
              <p className="text-blue-800">
                <strong>Most Active:</strong> September 2024 with 15 transactions
              </p>
              <p className="text-blue-800">
                <strong>Year Growth:</strong> {yearOverYearPercentage >= 0 ? '+' : ''}{yearOverYearPercentage.toFixed(1)}% vs 2023
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
