import AppLayout from '@/components/layout/AppLayout';
import TransactionForm from '@/components/forms/TransactionForm';

export default function AddTransactionPage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Transaction</h1>
          <p className="mt-2 text-gray-600">Record a new buy or sell transaction</p>
        </div>

        {/* Transaction Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TransactionForm />
        </div>
      </div>
    </AppLayout>
  );
}
