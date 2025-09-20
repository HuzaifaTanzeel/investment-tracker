import { TransactionFormData, ValidationError, Transaction } from '@/types';

/**
 * Validate PSX stock symbol
 */
export function validateSymbol(symbol: string): string | null {
  if (!symbol || symbol.trim().length === 0) {
    return 'Stock symbol is required';
  }
  
  const cleanSymbol = symbol.trim().toUpperCase();
  
  // PSX symbols are typically 3-6 characters, alphanumeric
  if (!/^[A-Z0-9]{3,6}$/.test(cleanSymbol)) {
    return 'Invalid PSX symbol format (3-6 alphanumeric characters)';
  }
  
  return null;
}

/**
 * Validate transaction date
 */
export function validateDate(dateString: string): string | null {
  if (!dateString) {
    return 'Date is required';
  }
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }
  
  if (date > today) {
    return 'Date cannot be in the future';
  }
  
  // Check if date is too far in the past (optional business rule)
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(today.getFullYear() - 10);
  
  if (date < tenYearsAgo) {
    return 'Date cannot be more than 10 years in the past';
  }
  
  return null;
}

/**
 * Validate quantity
 */
export function validateQuantity(quantityString: string): string | null {
  if (!quantityString || quantityString.trim() === '') {
    return 'Quantity is required';
  }
  
  const quantity = parseInt(quantityString, 10);
  
  if (isNaN(quantity)) {
    return 'Quantity must be a valid number';
  }
  
  if (quantity <= 0) {
    return 'Quantity must be greater than 0';
  }
  
  if (!Number.isInteger(quantity)) {
    return 'Quantity must be a whole number';
  }
  
  // PSX lot size check (most stocks trade in lots of 500)
  if (quantity % 500 !== 0) {
    return 'Warning: Most PSX stocks trade in lots of 500 shares';
  }
  
  return null;
}

/**
 * Validate rate (price per share)
 */
export function validateRate(rateString: string): string | null {
  if (!rateString || rateString.trim() === '') {
    return 'Rate is required';
  }
  
  const rate = parseFloat(rateString);
  
  if (isNaN(rate)) {
    return 'Rate must be a valid number';
  }
  
  if (rate <= 0) {
    return 'Rate must be greater than 0';
  }
  
  // Check decimal places (PSX allows up to 4 decimal places)
  const decimalPlaces = (rateString.split('.')[1] || '').length;
  if (decimalPlaces > 4) {
    return 'Rate can have maximum 4 decimal places';
  }
  
  // Reasonable range check for PSX (0.01 to 100,000 PKR per share)
  if (rate < 0.01) {
    return 'Rate cannot be less than 0.01 PKR';
  }
  
  if (rate > 100000) {
    return 'Rate seems unreasonably high (max 100,000 PKR)';
  }
  
  return null;
}

/**
 * Validate sell transaction against available holdings
 */
export function validateSellTransaction(
  formData: TransactionFormData,
  availableShares: number
): string | null {
  if (formData.type !== 'SELL') {
    return null;
  }
  
  const quantity = parseInt(formData.quantity, 10);
  
  if (isNaN(quantity) || quantity <= 0) {
    return 'Invalid quantity for sell transaction';
  }
  
  if (quantity > availableShares) {
    return `Cannot sell ${quantity} shares. Only ${availableShares} shares available`;
  }
  
  return null;
}

/**
 * Comprehensive form validation
 */
export function validateTransactionForm(
  formData: TransactionFormData,
  availableShares: number = 0
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Date validation
  const dateError = validateDate(formData.date);
  if (dateError) {
    errors.push({ field: 'date', message: dateError });
  }
  
  // Symbol validation
  const symbolError = validateSymbol(formData.symbol);
  if (symbolError) {
    errors.push({ field: 'symbol', message: symbolError });
  }
  
  // Quantity validation
  const quantityError = validateQuantity(formData.quantity);
  if (quantityError) {
    errors.push({ field: 'quantity', message: quantityError });
  }
  
  // Rate validation
  const rateError = validateRate(formData.rate);
  if (rateError) {
    errors.push({ field: 'rate', message: rateError });
  }
  
  // Sell transaction validation
  const sellError = validateSellTransaction(formData, availableShares);
  if (sellError) {
    errors.push({ field: 'quantity', message: sellError });
  }
  
  return errors;
}

/**
 * Check if form data is valid
 */
export function isFormValid(
  formData: TransactionFormData,
  availableShares: number = 0
): boolean {
  const errors = validateTransactionForm(formData, availableShares);
  return errors.length === 0;
}

/**
 * Get field error message
 */
export function getFieldError(
  errors: ValidationError[],
  fieldName: string
): string | null {
  const error = errors.find(e => e.field === fieldName);
  return error ? error.message : null;
}

/**
 * Sanitize and format input values
 */
export function sanitizeFormData(formData: TransactionFormData): TransactionFormData {
  return {
    date: formData.date.trim(),
    type: formData.type,
    symbol: formData.symbol.trim().toUpperCase(),
    quantity: formData.quantity.trim(),
    rate: formData.rate.trim(),
  };
}
