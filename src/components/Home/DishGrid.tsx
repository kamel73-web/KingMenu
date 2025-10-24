import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, Shuffle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DishCard from './DishCard';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

// Types
type CuisineType = {
  id: string;
  name: { [lang: string]: string };
  created_at?: string;
};

type DifficultyType = {
  id: string;
  label: { [lang: string]: string };
};

// Sub-components (same as before)
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
        <h3 className="text-2xl font-heading font-bold text-warm-gray-900 mb-3">
          {t('common.error')}
        </h3>
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
      <h3 className="text-2xl font-heading font-bold text-warm-gray-900 mb-3">
        {t('home.noDishesFound')}
      </h3>
      <p className="text-warm-gray-600 font-body text-base">
        {t('home.adjustFilters')}
      </p>
    </div>
  );
};

const ResultsHeader = ({ count }: { count: number }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-heading font-bold text-warm-gray-900">
        {t('home.recommendedDishes')}
      </h2>
      <span className="text-warm-gray-600 font-semibold text-lg">
        {count} {t('home.dishesFound')}
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
  translateDifficulty
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
        {/* Search */}
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

        {/* Cuisine Filter */}
        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="px-6 py-3.5 border-2 border-warm-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold transition-all"
        >
          <option value="">{t('home.allCuisines')}</option>
          {cuisineTypes.map(cuisine => (
            <option key={cuisine.id} value={cuisine.id}>
              {translateCuisine(cuisine)}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-6 py-3.5 border-2 border-warm-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold transition-all"
        >
          <option value="">{t('home.allDifficulties')}</option>
          {difficultyTypes.map(difficulty => (
            <option key={difficulty.id} value={difficulty.id}>
              {translateDifficulty(difficulty)}
            </option>
          ))}
        </select>

        {/* Surprise Me Button */}
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

// Main component
export default function DishGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const [difficultyTypes, setDifficultyTypes] = useState<DifficultyType[]>([]);
  
  const { state } = useApp();
  const { t, i18n } = useTranslation();
  const { translateDish } = useTranslatedContent();
  const { dishes: supabaseDishes, loading, error } = useSupabaseData();

  // Fetch cuisine types and difficulty types
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch cuisine types
        const { data: cuisineData, error: cuisineError } = await supabase
          .from('cuisine_types')
          .select('id, name, created_at')
          .order('id', { ascending: true });

        if (cuisineError) {
          throw new Error(`Cuisine types error: ${cuisineError.message}`);
        }

        if (cuisineData) {
          setCuisineTypes(cuisineData);
        }

        // Fetch difficulty types
        const { data: difficultyData, error: difficultyError } = await supabase
          .from('difficulties')
          .select('id, label')
          .order('id', { ascending: true });

        if (difficultyError) {
          throw new Error(`Difficulty types error: ${difficultyError.message}`);
        }

        if (difficultyData) {
          setDifficultyTypes(difficultyData);
        }
      } catch (error) {
        toast.error(t('errors.fetchFilters'));
        console.error('Error loading filter options:', error);
      }
    };
    
    fetchFilterOptions();
  }, [t]);

  // Debug: Log raw Supabase dishes
  useEffect(() => {
    console.log('Raw Supabase Dishes:', supabaseDishes);
    console.log('Cuisine Types:', cuisineTypes);
    console.log('Difficulty Types:', difficultyTypes);
  }, [supabaseDishes, cuisineTypes, difficultyTypes]);

  // Memoized translation functions
  const translateCuisine = useCallback((cuisine: CuisineType) => {
    return cuisine.name[i18n.language] || cuisine.name['en'] || '';
  }, [i18n.language]);

  const translateDifficulty = useCallback((difficulty: DifficultyType) => {
    return difficulty.label[i18n.language] || difficulty.label['en'] || '';
  }, [i18n.language]);

  // Memoized surprise me handler
  const handleSurpriseMe = useCallback(() => {
    const translatedDishes = supabaseDishes.map(dish => translateDish(dish));
    const availableDishes = translatedDishes.filter(dish => 
      !state.selectedDishes.some(selected => selected.id === dish.id)
    );
    
    if (availableDishes.length === 0) {
      toast.error(t('home.allDishesSelected'));
      return;
    }

    const randomDish = availableDishes[Math.floor(Math.random() * availableDishes.length)];
    toast.success(`${t('home.surprise')} ${randomDish.title}!`);
  }, [supabaseDishes, state.selectedDishes, t, translateDish]);

  // Memoized translated data with IDs preserved
  const translatedDishes = useMemo(() => {
    return supabaseDishes.map(dish => {
      const translatedDish = translateDish(dish);
      
      // Get the correct IDs based on your actual data structure
      // This is the key fix - we need to extract the IDs correctly
      let cuisineId = dish.cuisineId;
      let difficultyId = dish.difficultyId;
      
      // If IDs are not directly available, try to find them by name matching
      if (!cuisineId && dish.cuisine) {
        const matchedCuisine = cuisineTypes.find(c => 
          c.name[i18n.language] === dish.cuisine || c.name['en'] === dish.cuisine
        );
        cuisineId = matchedCuisine?.id;
      }
      
      if (!difficultyId && dish.difficulty) {
        const matchedDifficulty = difficultyTypes.find(d => 
          d.label[i18n.language] === dish.difficulty || d.label['en'] === dish.difficulty
        );
        difficultyId = matchedDifficulty?.id;
      }
      
      return {
        ...translatedDish,
        cuisineId,
        difficultyId
      };
    });
  }, [supabaseDishes, translateDish, cuisineTypes, difficultyTypes, i18n.language]);

  // Memoized filtered dishes
  const filteredDishes = useMemo(() => {
    const filtered = translatedDishes.filter(dish => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        (dish.title && dish.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dish.cuisine && dish.cuisine.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dish.description && dish.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Cuisine filter
      const matchesCuisine = !selectedCuisine || 
        (dish.cuisineId && dish.cuisineId.toString() === selectedCuisine);
      
      // Difficulty filter
      const matchesDifficulty = !selectedDifficulty || 
        (dish.difficultyId && dish.difficultyId.toString() === selectedDifficulty);
      
      // User preferences filter
      const matchesPreferences = !state.user?.preferences?.length || 
        state.user.preferences.some(pref => 
          dish.cuisineId && pref.toString() === dish.cuisineId.toString()
        );

      return matchesSearch && matchesCuisine && matchesDifficulty && matchesPreferences;
    });

    return filtered;
  }, [
    translatedDishes, 
    searchTerm, 
    selectedCuisine, 
    selectedDifficulty, 
    state.user?.preferences
  ]);

  // Debug: log filter states and dish data
  useEffect(() => {
    console.log('Selected Cuisine:', selectedCuisine, 'Type:', typeof selectedCuisine);
    console.log('Selected Difficulty:', selectedDifficulty, 'Type:', typeof selectedDifficulty);
    console.log('Filtered Dishes Count:', filteredDishes.length);
    
    if (filteredDishes.length > 0) {
      console.log('First filtered dish:', filteredDishes[0]);
    } else if (selectedCuisine || selectedDifficulty) {
      console.log('No dishes found with current filters');
      console.log('Available dishes with IDs:', translatedDishes.map(d => ({
        id: d.id,
        title: d.title,
        cuisine: d.cuisine,
        cuisineId: d.cuisineId,
        difficulty: d.difficulty,
        difficultyId: d.difficultyId
      })));
    }
  }, [selectedCuisine, selectedDifficulty, filteredDishes, translatedDishes]);

  // Loading and error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

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

      <ResultsHeader count={filteredDishes.length} />
      
      {/* Dish Grid */}
      {filteredDishes.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
    {filteredDishes.map(dish => (
      <DishCard key={dish.id} dish={dish} />
    ))}
  </div>
) : (
  <EmptyState />
)}
    </div>
  );
}
