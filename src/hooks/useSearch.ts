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
  const { i18n, t } = useTranslation();
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
        // ── Étape 1 : appel RPC full-text search ──────────────────────────
        const { data, error: rpcError } = await supabase.rpc('search_dishes', {
          query: debouncedQuery,
          lang: i18n.language,
          max_results: MAX_RESULTS,
        });

        if (controller.signal.aborted) return;

        if (rpcError) {
          // RPC indisponible (migration non appliquée) →
          // fallback : recherche locale simple sur getDishes
          console.warn('[useSearch] RPC indisponible, fallback local:', rpcError.message);
          await runLocalFallback(debouncedQuery, controller);
          return;
        }

        // ── Étape 2 : si aucun résultat RPC → vider et sortir ────────────
        const rpcRows = data || [];
        if (rpcRows.length === 0) {
          setResults([]);
          setLoading(false);
          return;
        }

        // ── Étape 3 : récupérer les plats complets ────────────────────────
        const ids = rpcRows.map((row: any) => String(row.id));
        const rankMap: Record<string, number> = {};
        rpcRows.forEach((row: any) => { rankMap[String(row.id)] = row.rank ?? 0; });

        const fullDishes = await getDishesByIds(ids, i18n.language);
        if (controller.signal.aborted) return;

        // ── Étape 4 : fusionner avec le rang ─────────────────────────────
        const normalized: SearchResult[] = fullDishes.map((dish: any) => ({
          ...dish,
          rank: rankMap[dish.id] ?? 0,
        }));
        normalized.sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0));
        setResults(normalized);

      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('[useSearch] Erreur inattendue:', err);
        // Ne pas propager l'erreur à l'ErrorBoundary —
        // on affiche juste un message non-fatal dans l'UI
        setError(t('home.searchError', { defaultValue: 'Recherche indisponible momentanément.' }));
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    // ── Fallback local si RPC non disponible ─────────────────────────────
    const runLocalFallback = async (q: string, controller: AbortController) => {
      try {
        const { data: allDishes } = await supabase
          .from('dishes')
          .select('id, name, description, image_url, cooking_time, rating, calories, servings, difficulty, cuisine_type, tags')
          .limit(200);

        if (controller.signal.aborted) return;

        const lower = q.toLowerCase();
        const filtered = (allDishes || []).filter((d: any) => {
          const name = typeof d.name === 'object'
            ? Object.values(d.name).join(' ')
            : String(d.name || '');
          const desc = typeof d.description === 'object'
            ? Object.values(d.description).join(' ')
            : String(d.description || '');
          return (name + ' ' + desc).toLowerCase().includes(lower);
        });

        const ids = filtered.map((d: any) => String(d.id));
        if (ids.length === 0) { setResults([]); return; }

        const fullDishes = await getDishesByIds(ids, i18n.language);
        if (controller.signal.aborted) return;

        setResults(fullDishes.map((d: any) => ({ ...d, rank: 0 })));
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('[useSearch] Fallback échoué:', err);
        setError(t('home.searchError', { defaultValue: 'Recherche indisponible momentanément.' }));
        setResults([]);
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

  const isSearching = loading || (
    query.trim().length >= MIN_QUERY_LENGTH &&
    query.trim() !== debouncedQuery
  );

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    hasResults: results.length > 0,
    isSearching,
    clear,
  };
}
