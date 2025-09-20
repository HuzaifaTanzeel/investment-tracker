'use client';

import { Plus, FileText, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    {
      title: 'Add Transaction',
      description: 'Record a new buy or sell',
      href: '/add-transaction',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'View Portfolio',
      description: 'Check current holdings',
      href: '/portfolio',
      icon: PieChart,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Monthly Report',
      description: 'View P&L breakdown',
      href: '/reports/monthly',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'All Transactions',
      description: 'Manage transaction history',
      href: '/transactions',
      icon: TrendingUp,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Link
            key={action.title}
            href={action.href}
            className={`${action.color} text-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-medium text-sm">{action.title}</h3>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
