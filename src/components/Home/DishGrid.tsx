// src/components/Home/DishGrid.tsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, Shuffle, Sparkles, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DishCard from './DishCard';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useFavorites } from '../../hooks/useFavorites';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type CuisineType = {
  id: string;
  name: { [lang: string]: string };
  created_at?: string;
};

type DifficultyType = {
  id: string;
  label: { [lang: string]: string };
};

// ─────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

const LoadingState = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-6" />
        <p className="text-warm-gray-600 font-body text-lg font-semibold">
          {t('common.loading')}
        </p>
      </div>
    </div>
  );
};

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-heading font-bold text-warm-gray-900 mb-3">
          {t('common.error')}
        </h3>
        <p className="text-warm-gray-600 font-body text-base mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          {t('common.retry', 'Réessayer')}
        </button>
      </div>
    </div>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-16">
      <Filter className="h-16 w-16 text-warm-gray-400 mx-auto mb-6" />
      <h3 className="text-2xl font-heading font-bold text-warm-gray-900 mb-3">
        {t('home.noDishesFound')}
      </h3>
      <p className="text-warm-gray-600 font-body text-base">
        {t('home.adjustFilters')}
      </p>
    </div>
  );
};

const ResultsHeader = ({
  totalCount,
  displayedCount,
}: {
  totalCount: number;
  displayedCount: number;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-heading font-bold text-warm-gray-900">
        {t('home.recommendedDishes')}
      </h2>
      <span className="text-warm-gray-600 font-semibold text-lg">
        {displayedCount < totalCount
          ? `${displayedCount} / ${totalCount}`
          : totalCount}{' '}
        {t('home.dishesFound')}
      </span>
    </div>
  );
};

const IngredientCTA = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-secondary-500 text-white rounded-3xl p-8 shadow-medium">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-heading font-bold mb-3">
            {t('home.cookWithIngredients')}
          </h3>
          <p className="font-body opacity-95 text-base">
            {t('home.cookWithIngredientsDesc')}
          </p>
        </div>
        <Link
          to="/use-my-ingredients"
          className="flex items-center space-x-2 px-8 py-4 bg-white text-secondary-500 rounded-full hover:bg-warm-gray-50 transition-all font-body font-bold shadow-medium hover:shadow-strong transform hover:scale-105"
        >
          <Sparkles className="h-6 w-6" />
          <span>{t('home.startWithIngredients')}</span>
        </Link>
      </div>
    </div>
  );
};

const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCuisine,
  setSelectedCuisine,
  selectedDifficulty,
  setSelectedDifficulty,
  cuisineTypes,
  difficultyTypes,
  handleSurpriseMe,
  translateCuisine,
  translateDifficulty,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
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
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-warm-gray-400" />
          <input
            type="text"
            placeholder={t('home.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border-2 border-warm-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-semibold"
          />
        </div>

        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="px-6 py-3.5 border-2 border-warm-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold transition-all"
        >
          <option value="">{t('home.allCuisines')}</option>
          {cuisineTypes.map((cuisine) => (
            <option key={cuisine.id} value={cuisine.id}>
              {translateCuisine(cuisine)}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-6 py-3.5 border-2 border-warm-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold transition-all"
        >
          <option value="">{t('home.allDifficulties')}</option>
          {difficultyTypes.map((difficulty) => (
            <option key={difficulty.id} value={difficulty.id}>
              {translateDifficulty(difficulty)}
            </option>
          ))}
        </select>

        <button
          onClick={handleSurpriseMe}
          className="flex items-center space-x-2 px-6 py-3.5 bg-accent-500 text-white rounded-full hover:bg-accent-600 transition-all shadow-medium font-semibold transform hover:scale-105"
        >
          <Shuffle className="h-5 w-5" />
          <span className="font-body font-semibold">{t('home.surpriseMe')}</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────

export default function DishGrid() {
  const [searchTerm, setSearchTerm]           = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [cuisineTypes, setCuisineTypes]         = useState<CuisineType[]>([]);
  const [difficultyTypes, setDifficultyTypes]   = useState<DifficultyType[]>([]);
  // CORRIGÉ : pagination — afficher par tranches de PAGE_SIZE
  const [displayedCount, setDisplayedCount]     = useState(PAGE_SIZE);

  const { state } = useApp();
  const { t, i18n } = useTranslation();
  const { translateDish } = useTranslatedContent();
  const { dishes: supabaseDishes, loading, error, refetch } = useSupabaseData();
  const userId = state.user?.id ?? '';
  const { favorites, toggleFavorite } = useFavorites(userId);

  // Charger les options de filtres (cuisine, difficulté)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [{ data: cuisineData }, { data: difficultyData }] = await Promise.all([
          supabase.from('cuisine_types').select('id, name, created_at').order('id'),
          supabase.from('difficulties').select('id, label').order('id'),
        ]);

        if (cuisineData) setCuisineTypes(cuisineData);
        if (difficultyData) setDifficultyTypes(difficultyData);
      } catch (err) {
        console.error('Erreur chargement filtres:', err);
        // Non bloquant — les filtres resteront vides, pas d'erreur UI
      }
    };

    fetchFilterOptions();
  }, []); // Pas de dépendance sur `t` — les options ne changent pas avec la langue

  // Fonctions de traduction stables
  const translateCuisine = useCallback(
    (cuisine: CuisineType) =>
      cuisine.name[i18n.language] || cuisine.name['en'] || '',
    [i18n.language]
  );

  const translateDifficulty = useCallback(
    (difficulty: DifficultyType) =>
      difficulty.label[i18n.language] || difficulty.label['en'] || '',
    [i18n.language]
  );

  // Handler "Surprise me" — ajoute un plat non sélectionné au hasard
  const handleSurpriseMe = useCallback(() => {
    const available = supabaseDishes.filter(
      (dish) => !state.selectedDishes.some((s) => s.id === dish.id)
    );
    if (available.length === 0) {
      toast.error(t('home.allDishesSelected'));
      return;
    }
    const random = available[Math.floor(Math.random() * available.length)];
    toast.success(`${t('home.surprise')} ${random.title}!`);
  }, [supabaseDishes, state.selectedDishes, t]);

  // Plats traduits avec IDs de filtre préservés
  const translatedDishes = useMemo(() => {
    return supabaseDishes.map((dish) => {
      const translated = translateDish(dish);
      const dishAny = dish as any;

      // Résoudre cuisineId par correspondance de nom si absent
      let cuisineId = dish.cuisineId;
      if (!cuisineId && dish.cuisine) {
        const match = cuisineTypes.find(
          (c) =>
            c.name[i18n.language] === dish.cuisine || c.name['en'] === dish.cuisine
        );
        cuisineId = match?.id;
      }

      // Résoudre difficultyId
      let difficultyId = dishAny.difficultyId as string | undefined;
      if (!difficultyId && dishAny.difficulty) {
        const diffStr =
          typeof dishAny.difficulty === 'string'
            ? dishAny.difficulty
            : dishAny.difficulty[i18n.language] || dishAny.difficulty['en'] || '';
        const match = difficultyTypes.find(
          (d) =>
            d.label[i18n.language]?.toLowerCase() === diffStr.toLowerCase() ||
            d.label['en']?.toLowerCase() === diffStr.toLowerCase()
        );
        difficultyId = match?.id;
      }

      return { ...translated, cuisineId, difficultyId } as any;
    });
  }, [supabaseDishes, translateDish, cuisineTypes, difficultyTypes, i18n.language]);

  // Filtrage
  const filteredDishes = useMemo(() => {
    return translatedDishes.filter((dish) => {
      const matchesSearch =
        !searchTerm ||
        dish.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCuisine =
        !selectedCuisine ||
        (dish.cuisineId && dish.cuisineId.toString() === selectedCuisine);

      const matchesDifficulty =
        !selectedDifficulty ||
        (dish.difficultyId && dish.difficultyId.toString() === selectedDifficulty);

      // Filtre préférences utilisateur (si configurées)
      const userPrefs = state.user?.preferences;
      const matchesPreferences =
        !userPrefs?.length ||
        userPrefs.some(
          (pref) => dish.cuisineId && pref.toString() === dish.cuisineId.toString()
        );

      return matchesSearch && matchesCuisine && matchesDifficulty && matchesPreferences;
    });
  }, [translatedDishes, searchTerm, selectedCuisine, selectedDifficulty, state.user?.preferences]);

  // Réinitialiser la pagination à chaque changement de filtre
  useEffect(() => {
    setDisplayedCount(PAGE_SIZE);
  }, [searchTerm, selectedCuisine, selectedDifficulty]);

  // Plats affichés (slice paginée)
  const visibleDishes = useMemo(
    () => filteredDishes.slice(0, displayedCount),
    [filteredDishes, displayedCount]
  );

  const hasMore = displayedCount < filteredDishes.length;

  // ── Rendu ────────────────────────────────────────────────────

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <IngredientCTA />

      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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

      <ResultsHeader
        totalCount={filteredDishes.length}
        displayedCount={visibleDishes.length}
      />

      {visibleDishes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
            {visibleDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {/* Bouton "Charger plus" */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setDisplayedCount((n) => n + PAGE_SIZE)}
                className="px-8 py-3 bg-white border-2 border-warm-gray-200 text-warm-gray-700 rounded-full hover:border-primary-500 hover:text-primary-500 transition-all font-semibold shadow-soft"
              >
                {t('home.loadMore', 'Charger plus')} (
                {filteredDishes.length - displayedCount})
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
