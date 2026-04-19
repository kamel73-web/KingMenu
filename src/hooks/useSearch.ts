// src/hooks/useSearch.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
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
          console.warn('[useSearch] RPC error (migration appliquée ?):', rpcError.message);
          setError('Search temporarily unavailable.');
          setResults([]);
          return;
        }

        const normalized: SearchResult[] = (data || []).map((row: any) => ({
          id: String(row.id),
          title: row.name?.[i18n.language] || row.name?.en || 'Untitled Dish',
          description: row.description?.[i18n.language] || row.description?.en || '',
          image: row.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
          cuisine: row.cuisine || '',
          cuisineId: null,
          cookingTime: Number(row.cooking_time) || 30,
          rating: Number(row.rating) || 4.5,
          difficulty: typeof row.difficulty === 'string' ? row.difficulty.toLowerCase() : 'medium',
          servings: Number(row.servings) || 4,
          calories: Number(row.calories) || 400,
          tags: Array.isArray(row.tags) ? row.tags : [],
          ingredients: [],
          instructions: [],
          translations: {},
          instructionTranslations: {},
          rank: row.rank,
        }));

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