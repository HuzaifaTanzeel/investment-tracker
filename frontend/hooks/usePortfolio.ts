'use client';

import { useState, useEffect } from 'react';
import { Holding, PnLSummary } from '@/types';
import { portfolioApi } from '@/utils/api';

interface UsePortfolioReturn {
  holdings: Holding[];
  summary: PnLSummary | null;
  availableShares: Record<string, number>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePortfolio(): UsePortfolioReturn {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PnLSummary | null>(null);
  const [availableShares, setAvailableShares] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all portfolio data in parallel
      const [holdingsResponse, summaryResponse, availableSharesResponse] = await Promise.all([
        portfolioApi.getHoldings(),
        portfolioApi.getSummary(),
        portfolioApi.getAvailableShares(),
      ]);

      setHoldings(holdingsResponse);
      setSummary(summaryResponse);
      setAvailableShares(availableSharesResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
      setHoldings([]);
      setSummary(null);
      setAvailableShares({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  return {
    holdings,
    summary,
    availableShares,
    loading,
    error,
    refetch: fetchPortfolioData,
  };
}

// Hook for specific script holding
export function useScriptHolding(symbol: string) {
  const [holding, setHolding] = useState<Holding | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScriptHolding = async () => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const scriptHolding = await portfolioApi.getScriptHolding(symbol);
      setHolding(scriptHolding);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch script holding');
      setHolding(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScriptHolding();
  }, [symbol]);

  return {
    holding,
    loading,
    error,
    refetch: fetchScriptHolding,
  };
}
