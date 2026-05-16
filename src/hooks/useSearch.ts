// src/hooks/useSearch.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, getDishesByIds } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { Dish } from '../types';

export interface SearchResult extends Dish {
  rank?: number;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  hasResults: boolean;
  isSearching: boolean;
  clear: () => void;
}

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 30;

export function useSearch(): UseSearchReturn {
  const { i18n } = useTranslation();
  const [query, setQueryState] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(q.trim());
    }, DEBOUNCE_MS);
  }, []);

  const clear = useCallback(() => {
    setQueryState('');
    setDebouncedQuery('');
    setResults([]);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const runSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: rpcError } = await supabase.rpc('search_dishes', {
          query: debouncedQuery,
          lang: i18n.language,
          max_results: MAX_RESULTS,
        });

        if (controller.signal.aborted) return;

        if (rpcError) {
          console.warn('[useSearch] RPC error:', rpcError.message);
          setError('Search temporarily unavailable.');
          setResults([]);
          return;
        }

        // Étape 1 — extraire les IDs et les scores de pertinence du RPC
        const ids = (data || []).map((row: any) => String(row.id));
        const rankMap: Record<string, number> = {};
        (data || []).forEach((row: any) => { rankMap[String(row.id)] = row.rank ?? 0; });

        // Étape 2 — récupérer les plats complets avec ingrédients et étapes
        const fullDishes = await getDishesByIds(ids, i18n.language);

        if (controller.signal.aborted) return;

        // Étape 3 — fusionner : données complètes + rank du RPC
        const normalized: SearchResult[] = fullDishes.map((dish: any) => ({
          ...dish,
          rank: rankMap[dish.id] ?? 0,
        }));

        // Trier par pertinence décroissante
        normalized.sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0));

        setResults(normalized);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('[useSearch] Unexpected error:', err);
        setError('Search failed. Please try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    runSearch();
    return () => { controller.abort(); };
  }, [debouncedQuery, i18n.language]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const isSearching = loading || (query.trim().length >= MIN_QUERY_LENGTH && query.trim() !== debouncedQuery);

  return { query, setQuery, results, loading, error, hasResults: results.length > 0, isSearching, clear };
}
