import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { FileText, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  const reportTypes = [
    {
      title: 'Monthly Reports',
      description: 'View profit & loss breakdown by month',
      href: '/reports/monthly',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Yearly Reports',
      description: 'Annual P&L summary and trends',
      href: '/reports/yearly',
      icon: BarChart3,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Script-wise P&L',
      description: 'Realized P&L by stock symbol',
      href: '/reports/script-wise',
      icon: TrendingUp,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Tax Reports',
      description: 'Generate tax-ready reports',
      href: '/reports/tax',
      icon: FileText,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-2 text-gray-600">
            Analyze your investment performance with detailed reports
          </p>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report) => {
            const IconComponent = report.icon;
            return (
              <Link
                key={report.title}
                href={report.href}
                className={`${report.color} text-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <IconComponent className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{report.title}</h3>
                    <p className="mt-2 text-sm opacity-90">{report.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Total Months Traded</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">PKR 40,500</p>
              <p className="text-sm text-gray-600">Best Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">15</p>
              <p className="text-sm text-gray-600">Unique Scripts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">68%</p>
              <p className="text-sm text-gray-600">Win Rate</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
