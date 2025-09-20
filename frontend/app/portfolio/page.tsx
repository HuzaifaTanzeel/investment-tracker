import AppLayout from '@/components/layout/AppLayout';
import CurrentHoldingsTable from '@/components/tables/CurrentHoldingsTable';
import PortfolioSummary from '@/components/cards/PortfolioSummary';

export default function PortfolioPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="mt-2 text-gray-600">Your current holdings and investment summary</p>
        </div>

        {/* Portfolio Summary */}
        <PortfolioSummary />

        {/* Current Holdings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Current Holdings</h2>
          </div>
          <CurrentHoldingsTable />
        </div>
      </div>
    </AppLayout>
  );
}
