'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { transactionApi } from '@/utils/api';

interface UseTransactionsOptions {
  autoFetch?: boolean;
  page?: number;
  limit?: number;
  symbol?: string;
  type?: 'BUY' | 'SELL';
  startDate?: string;
  endDate?: string;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
}

export function useTransactions(options: UseTransactionsOptions = {}): UseTransactionsReturn {
  const { autoFetch = true, ...filters } = options;
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(filters.page || 1);
  const [limit] = useState(filters.limit || 10);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionApi.getAll({ page, limit, ...filters });
      setTransactions(response.data);
      setTotal(response.total);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTransaction = await transactionApi.create(transactionData);
      await fetchTransactions(); // Refresh the list
      return newTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    try {
      const updatedTransaction = await transactionApi.update(id, transactionData);
      await fetchTransactions(); // Refresh the list
      return updatedTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionApi.delete(id);
      await fetchTransactions(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTransactions();
    }
  }, [autoFetch, page, JSON.stringify(filters)]);

  const totalPages = Math.ceil(total / limit);

  return {
    transactions,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

// Hook for recent transactions
export function useRecentTransactions(limit: number = 5) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const recentTransactions = await transactionApi.getRecent(limit);
      setTransactions(recentTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTransactions();
  }, [limit]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchRecentTransactions,
  };
}
