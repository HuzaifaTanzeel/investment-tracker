import AppLayout from '@/components/layout/AppLayout';
import TransactionTable from '@/components/tables/TransactionTable';
import TransactionFilters from '@/components/filters/TransactionFilters';

export default function TransactionsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="mt-2 text-gray-600">Manage all your buy and sell transactions</p>
          </div>
          <a
            href="/add-transaction"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Add Transaction
          </a>
        </div>

        {/* Filters */}
        <TransactionFilters />

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <TransactionTable />
        </div>
      </div>
    </AppLayout>
  );
}
