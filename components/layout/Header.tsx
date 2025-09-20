'use client';

import { TrendingUp, User, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PSX Tracker</h1>
              <p className="text-xs text-gray-500">Pakistan Stock Exchange</p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/transactions" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Transactions
            </Link>
            <Link 
              href="/portfolio" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Portfolio
            </Link>
            <Link 
              href="/reports" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Reports
            </Link>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/add-transaction"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Transaction
            </Link>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <Link href="/settings" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-3 space-y-1">
          <Link 
            href="/dashboard" 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/transactions" 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Transactions
          </Link>
          <Link 
            href="/portfolio" 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Portfolio
          </Link>
          <Link 
            href="/reports" 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Reports
          </Link>
        </div>
      </div>
    </header>
  );
}
