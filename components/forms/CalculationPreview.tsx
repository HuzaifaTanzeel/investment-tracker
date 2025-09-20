'use client';

import { Calculator } from 'lucide-react';
import { calculateCharges, calculateNetAmount, formatCurrency } from '@/utils/calculations';

interface CalculationPreviewProps {
  quantity: number;
  rate: number;
  type: 'BUY' | 'SELL';
}

export default function CalculationPreview({ quantity, rate, type }: CalculationPreviewProps) {
  if (!quantity || !rate || isNaN(quantity) || isNaN(rate)) {
    return null;
  }

  const grossValue = quantity * rate;
  const charges = calculateCharges(quantity, rate);
  const netAmount = calculateNetAmount(quantity, rate, type);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Calculator className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-blue-900">
          Transaction Preview ({type})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Transaction Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
            Transaction Details
          </h4>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Shares:</span>
            <span className="font-mono">{quantity.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Rate per share:</span>
            <span className="font-mono">{formatCurrency(rate)}</span>
          </div>
          
          <div className="flex justify-between font-medium">
            <span className="text-gray-900">Gross Value:</span>
            <span className="font-mono">{formatCurrency(grossValue)}</span>
          </div>
        </div>

        {/* Right Column - Charges Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
            Charges Breakdown
          </h4>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Commission (0.15%):</span>
            <span className="font-mono">{formatCurrency(charges.commission)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">SST (16% on commission):</span>
            <span className="font-mono">{formatCurrency(charges.sst)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">CDC (0.02%):</span>
            <span className="font-mono">{formatCurrency(charges.cdc)}</span>
          </div>
          
          <div className="flex justify-between font-medium text-red-600 border-t border-gray-200 pt-2">
            <span>Total Charges:</span>
            <span className="font-mono">{formatCurrency(charges.totalCharges)}</span>
          </div>
        </div>
      </div>

      {/* Net Amount */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            Net Amount {type === 'BUY' ? 'Required' : 'Received'}:
          </span>
          <span className={`text-xl font-bold font-mono ${
            type === 'BUY' ? 'text-red-600' : 'text-green-600'
          }`}>
            {formatCurrency(netAmount)}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600">
          {type === 'BUY' 
            ? 'This is the total amount that will be debited from your account'
            : 'This is the net amount you will receive after charges'
          }
        </p>
      </div>

      {/* PSX Trading Info */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>PSX Trading Info:</strong> Minimum commission is PKR 20. 
          Most stocks trade in lots of 500 shares. 
          Settlement is T+2 (trade date plus 2 working days).
        </p>
      </div>
    </div>
  );
}
