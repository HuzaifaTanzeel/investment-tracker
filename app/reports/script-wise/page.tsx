import AppLayout from '@/components/layout/AppLayout';
import ScriptPnLTable from '@/components/tables/ScriptPnLTable';

export default function ScriptWiseReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Script-wise P&L</h1>
            <p className="mt-2 text-gray-600">Realized profit & loss breakdown by stock symbol</p>
          </div>
          
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Scripts</option>
              <option>Profitable Only</option>
              <option>Loss-making Only</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Script P&L Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Script Performance Summary</h2>
          </div>
          <ScriptPnLTable />
        </div>
      </div>
    </AppLayout>
  );
}
