'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { TransactionFormData, ValidationError, Transaction } from '@/types';
import { validateTransactionForm, sanitizeFormData, getFieldError } from '@/utils/validation';
import { calculateCharges, calculateNetAmount, formatCurrency } from '@/utils/calculations';
import CalculationPreview from './CalculationPreview';
import { useRouter } from 'next/navigation';

interface TransactionFormProps {
  onSubmit?: (data: TransactionFormData) => void;
  initialData?: Partial<TransactionFormData>;
  availableShares?: Record<string, number>; // symbol -> available shares
}

export default function TransactionForm({ 
  onSubmit, 
  initialData,
  availableShares = {}
}: TransactionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0], // Today's date
    type: 'BUY',
    symbol: '',
    quantity: '',
    rate: '',
    ...initialData,
  });
  
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form whenever data changes
  useEffect(() => {
    if (formData.symbol && formData.quantity && formData.rate) {
      const availableForSymbol = availableShares[formData.symbol.toUpperCase()] || 0;
      const validationErrors = validateTransactionForm(formData, availableForSymbol);
      setErrors(validationErrors);
    } else {
      setErrors([]);
    }
  }, [formData, availableShares]);

  const handleInputChange = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedData = sanitizeFormData(formData);
    const availableForSymbol = availableShares[sanitizedData.symbol] || 0;
    const validationErrors = validateTransactionForm(sanitizedData, availableForSymbol);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        onSubmit(sanitizedData);
      } else {
        // Default behavior: convert to Transaction and navigate
        const quantity = parseInt(sanitizedData.quantity);
        const rate = parseFloat(sanitizedData.rate);
        const charges = calculateCharges(quantity, rate);
        const netAmount = calculateNetAmount(quantity, rate, sanitizedData.type);
        
        const transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
          date: sanitizedData.date,
          type: sanitizedData.type,
          symbol: sanitizedData.symbol,
          quantity,
          rate,
          commission: charges.commission,
          sst: charges.sst,
          cdc: charges.cdc,
          totalCharges: charges.totalCharges,
          netAmount,
        };
        
        // Here we would normally call the API to create the transaction
        console.log('Creating transaction:', transaction);
        
        // Navigate to transactions page
        router.push('/transactions');
      }
      
      // Reset form after successful submission
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'BUY',
        symbol: '',
        quantity: '',
        rate: '',
      });
      setErrors([]);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = errors.length === 0 && 
    formData.symbol && 
    formData.quantity && 
    formData.rate &&
    formData.date;

  const showCalculation = formData.quantity && formData.rate && 
    !isNaN(parseFloat(formData.quantity)) && 
    !isNaN(parseFloat(formData.rate));

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Transaction Type
          </label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleInputChange('type', 'BUY')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-colors ${
                formData.type === 'BUY'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Buy
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('type', 'SELL')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-colors ${
                formData.type === 'SELL'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Sell
            </button>
          </div>
        </div>

        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              getFieldError(errors, 'date') ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {getFieldError(errors, 'date') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'date')}</p>
          )}
        </div>

        {/* Symbol Input */}
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
            Stock Symbol (PSX)
          </label>
          <input
            type="text"
            id="symbol"
            value={formData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
            placeholder="e.g., TRG, OGDC, LUCK"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              getFieldError(errors, 'symbol') ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {getFieldError(errors, 'symbol') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'symbol')}</p>
          )}
          {formData.type === 'SELL' && formData.symbol && (
            <p className="mt-1 text-sm text-blue-600">
              Available: {availableShares[formData.symbol] || 0} shares
            </p>
          )}
        </div>

        {/* Quantity and Rate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (Shares)
            </label>
            <input
              type="number"
              id="quantity"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="500"
              min="1"
              step="1"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                getFieldError(errors, 'quantity') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError(errors, 'quantity') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'quantity')}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">PSX lots are typically 500 shares</p>
          </div>

          {/* Rate */}
          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-2">
              Rate (PKR per share)
            </label>
            <input
              type="number"
              id="rate"
              value={formData.rate}
              onChange={(e) => handleInputChange('rate', e.target.value)}
              placeholder="45.50"
              min="0.01"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                getFieldError(errors, 'rate') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError(errors, 'rate') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'rate')}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Up to 4 decimal places</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData({
                date: new Date().toISOString().split('T')[0],
                type: 'BUY',
                symbol: '',
                quantity: '',
                rate: '',
              });
              setErrors([]);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isFormValid && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Adding...' : `Add ${formData.type} Transaction`}
          </button>
        </div>
      </form>

      {/* Calculation Preview */}
      {showCalculation && (
        <CalculationPreview
          quantity={parseInt(formData.quantity)}
          rate={parseFloat(formData.rate)}
          type={formData.type}
        />
      )}
    </div>
  );
}
