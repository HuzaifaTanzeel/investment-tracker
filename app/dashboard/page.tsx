import AppLayout from '@/components/layout/AppLayout';
import InvestmentSummary from '@/components/cards/InvestmentSummary';
import MonthlyPnLCard from '@/components/cards/MonthlyPnLCard';
import RecentTransactions from '@/components/tables/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of your PSX investment portfolio</p>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InvestmentSummary />
          <MonthlyPnLCard />
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Holdings:</span>
                <span className="font-medium">5 Scripts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month Trades:</span>
                <span className="font-medium">12 Transactions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Monthly P&L:</span>
                <span className="font-medium text-green-600">+PKR 15,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
              <a href="/transactions" className="text-blue-600 hover:text-blue-800 font-medium">
                View All
              </a>
            </div>
          </div>
          <RecentTransactions limit={5} />
        </div>
      </div>
    </AppLayout>
  );
}
