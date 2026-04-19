import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, Filter, Shuffle, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DishCard from './DishCard';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useFavorites } from '../../hooks/useFavorites';
import { useSearch } from '../../hooks/useSearch';

type CuisineType = {
  id: string;
  name: { [lang: string]: string };
  created_at?: string;
};

type DifficultyType = {
  id: string;
  label: { [lang: string]: string };
};

const LoadingState = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-6"></div>
        <p className="text-warm-gray-600 font-body text-lg font-semibold">{t('common.loading')}</p>
      </div>
    </div>
  );
};

const ErrorState = ({ error }: { error: string }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-heading font-bold text-warm-gray-900 mb-3">{t('common.error')}</h3>
        <p className="text-warm-gray-600 font-body text-base">{error}</p>
      </div>
    </div>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-16">
      <Filter className="h-16 w-16 text-warm-gray-400 mx-auto mb-6" />
      <h3 className="text-2xl font-heading font-bold text-warm-gray-900 mb-3">{t('home.noDishesFound')}</h3>
      <p className="text-warm-gray-600 font-body text-base">{t('home.adjustFilters')}</p>
    </div>
  );
};

const ResultsHeader = ({ count, isSearchMode }: { count: number; isSearchMode: boolean }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-heading font-bold text-warm-gray-900">
        {isSearchMode ? t('home.searchResults', { defaultValue: 'Search results' }) : t('home.recommendedDishes')}
      </h2>
      <span className="text-warm-gray-600 font-semibold text-lg">
        {count} {t('home.dishesFound')}
      </span>
    </div>
  );
};

const SearchAndFilters = ({
  searchQuery, setSearchQuery, isSearching,
  selectedCuisine, setSelectedCuisine,
  selectedDifficulty, setSelectedDifficulty,
  cuisineTypes, difficultyTypes,
  handleSurpriseMe, translateCuisine, translateDifficulty,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isSearching: boolean;
  selectedCuisine: string;
  setSelectedCuisine: (value: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (value: string) => void;
  cuisineTypes: CuisineType[];
  difficultyTypes: DifficultyType[];
  handleSurpriseMe: () => void;
  translateCuisine: (cuisine: CuisineType) => string;
  translateDifficulty: (difficulty: DifficultyType) => string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-3xl shadow-soft p-8">
      <div className="flex flex-col md:flex-row gap-4">

        {/* Full-Text Search Input */}
        <div className="flex-1 relative">
          {isSearching ? (
            <Loader2 className="absolute left-4 top-4 h-5 w-5 text-primary-500 animate-spin" />
          ) : (
            <Search className="absolute left-4 top-4 h-5 w-5 text-warm-gray-400" />
          )}
          <input
            type="text"
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 border-2 border-warm-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-semibold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-4 text-warm-gray-400 hover:text-warm-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filters — masqués pendant la recherche FTS */}
        {!searchQuery && (
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="px-6 py-3.5 border-2 border-warm-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold transition-all"
          >
            <option value="">{t('home.allCuisines')}</option>
            {cuisineTypes.map(cuisine => (
              <option key={cuisine.id} value={cuisine.id}>{translateCuisine(cuisine)}</option>
            ))}
          </select>
        )}

        {!searchQuery && (
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-6 py-3.5 border-2 border-warm-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold transition-all"
          >
            <option value="">{t('home.allDifficulties')}</option>
            {difficultyTypes.map(difficulty => (
              <option key={difficulty.id} value={difficulty.id}>{translateDifficulty(difficulty)}</option>
            ))}
          </select>
        )}

        <button
          onClick={handleSurpriseMe}
          className="flex items-center space-x-2 px-6 py-3.5 bg-accent-500 text-white rounded-full hover:bg-accent-600 transition-all shadow-medium font-semibold transform hover:scale-105"
        >
          <Shuffle className="h-5 w-5" />
          <span className="font-body font-semibold">{t('home.surpriseMe')}</span>
        </button>
      </div>

      {searchQuery.length >= 2 && (
        <p className="text-xs text-warm-gray-400 mt-3 ml-4">
          🔍 {t('home.searchHint', { defaultValue: 'Searching full recipe database…' })}
        </p>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function DishGrid() {
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const [difficultyTypes, setDifficultyTypes] = useState<DifficultyType[]>([]);

  const { state } = useApp();
  const { t, i18n } = useTranslation();
  const { translateDish } = useTranslatedContent();
  const { dishes: supabaseDishes, loading, error } = useSupabaseData();
  const userId = state.user?.id ?? '';
  const { favorites, toggleFavorite } = useFavorites(userId);

  // Full-text search
  const { query: searchQuery, setQuery: setSearchQuery, results: searchResults, isSearching, error: searchError } = useSearch();
  const isSearchMode = searchQuery.trim().length >= 2;

  // Load filter options — un seul fetch groupé, pas de double-mount en StrictMode
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchFilterOptions = async () => {
      try {
        const [cuisineResult, difficultyResult] = await Promise.all([
          supabase.from('cuisine_types').select('id, name, created_at').order('id', { ascending: true }),
          supabase.from('difficulties').select('id, label').order('id', { ascending: true }),
        ]);
        if (cuisineResult.error) throw new Error(cuisineResult.error.message);
        if (difficultyResult.error) throw new Error(difficultyResult.error.message);
        if (cuisineResult.data)    setCuisineTypes(cuisineResult.data);
        if (difficultyResult.data) setDifficultyTypes(difficultyResult.data);
      } catch (error) {
        toast.error(t('errors.fetchFilters'));
        console.error('Error loading filter options:', error);
      }
    };
    fetchFilterOptions();
  }, [t]);

  const translateCuisine = useCallback((cuisine: CuisineType) =>
    cuisine.name[i18n.language] || cuisine.name['en'] || '', [i18n.language]);

  const translateDifficulty = useCallback((difficulty: DifficultyType) =>
    difficulty.label[i18n.language] || difficulty.label['en'] || '', [i18n.language]);

  const handleSurpriseMe = useCallback(() => {
    const translated = supabaseDishes.map(d => translateDish(d));
    const available = translated.filter(d => !state.selectedDishes.some(s => s.id === d.id));
    if (available.length === 0) { toast.error(t('home.allDishesSelected')); return; }
    const random = available[Math.floor(Math.random() * available.length)];
    toast.success(`${t('home.surprise')} ${random.title}!`);
  }, [supabaseDishes, state.selectedDishes, t, translateDish]);

  const cuisineMap = useMemo(() => {
    const map = new Map<string, string>();
    cuisineTypes.forEach(c => map.set(String(c.id), String(c.id)));
    return map;
  }, [cuisineTypes]);

  const difficultyMap = useMemo(() => {
    const map = new Map<string, string>();
    difficultyTypes.forEach(d => map.set(String(d.id), String(d.id)));
    return map;
  }, [difficultyTypes]);

  const translatedDishes = useMemo(() => {
    return supabaseDishes.map(dish => {
      const translated = translateDish(dish);
      const dishAny = dish as any;
      let cuisineId = dish.cuisineId;
      let difficultyId = dishAny.difficultyId as string | undefined;

      if (!cuisineId && dish.cuisine) {
        const match = cuisineTypes.find(c => c.name[i18n.language] === dish.cuisine || c.name['en'] === dish.cuisine);
        cuisineId = match?.id;
      }
      if (!difficultyId && dishAny.difficulty) {
        const match = difficultyTypes.find(d => d.label[i18n.language] === dishAny.difficulty || d.label['en'] === dishAny.difficulty);
        difficultyId = match?.id;
      }
      return { ...translated, cuisineId, difficultyId } as any;
    });
  }, [supabaseDishes, translateDish, cuisineMap, difficultyMap, i18n.language, cuisineTypes, difficultyTypes]);

  const filteredDishes = useMemo(() => {
    return translatedDishes.filter(dish => {
      const matchesCuisine = !selectedCuisine || (dish.cuisineId && dish.cuisineId.toString() === selectedCuisine);
      const matchesDifficulty = !selectedDifficulty || (dish.difficultyId && dish.difficultyId.toString() === selectedDifficulty);
      const matchesPreferences = !state.user?.preferences?.length ||
        state.user.preferences.some((pref: string) => (dish as any).cuisineId && pref.toString() === (dish as any).cuisineId.toString());
      return matchesCuisine && matchesDifficulty && matchesPreferences;
    });
  }, [translatedDishes, selectedCuisine, selectedDifficulty, state.user?.preferences]);

  // Search mode → FTS results ; Browse mode → filtered local list
  const displayedDishes = isSearchMode ? searchResults : filteredDishes;

  // ── INFINITE SCROLL ────────────────────────────────────────────────────────
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset à 12 quand les filtres ou le mode de recherche changent
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedCuisine, selectedDifficulty]);

  // IntersectionObserver sur la sentinelle invisible en bas de grille
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, displayedDishes.length));
        }
      },
      { rootMargin: '200px' } // déclenche 200px avant le bas visible
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [displayedDishes.length]);

  const visibleDishes = displayedDishes.slice(0, visibleCount);
  const hasMore = visibleCount < displayedDishes.length;
  // ──────────────────────────────────────────────────────────────────────────

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState error={error} />;

  return (
    <div className="space-y-6">
      <SearchAndFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        selectedCuisine={selectedCuisine}
        setSelectedCuisine={setSelectedCuisine}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        cuisineTypes={cuisineTypes}
        difficultyTypes={difficultyTypes}
        handleSurpriseMe={handleSurpriseMe}
        translateCuisine={translateCuisine}
        translateDifficulty={translateDifficulty}
      />

      {searchError && isSearchMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-amber-700 text-sm font-medium">
          ⚠️ {searchError}
        </div>
      )}

      <ResultsHeader count={displayedDishes.length} isSearchMode={isSearchMode} />

      {displayedDishes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
            {visibleDishes.map(dish => (
              <DishCard key={dish.id} dish={dish} favorites={favorites} toggleFavorite={toggleFavorite} />
            ))}
          </div>

          {/* Sentinelle invisible — l'IntersectionObserver la surveille */}
          <div ref={sentinelRef} className="w-full h-4" />

          {/* Spinner affiché tant qu'il reste des recettes à charger */}
          {hasMore && (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
