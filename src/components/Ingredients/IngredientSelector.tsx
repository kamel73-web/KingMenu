import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Ingredient, OwnedIngredient } from '../../types';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';

interface IngredientSelectorProps {
  onFindDishes?: (ingredients: OwnedIngredient[]) => void;
}

const IngredientSelector = ({ onFindDishes }: IngredientSelectorProps) => {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useApp();
  const { translateCategoryName, translateIngredientName } = useTranslatedContent();

  const selectedIngredients = state.selectedIngredients ?? [];

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('ingredients').select('*');
      if (error) {
        console.error('Erreur de chargement des ingrédients:', error.message);
      } else if (data) {
        setIngredients(
          data.map((ing: any) => ({
            ...ing,
            id: ing.id?.toString() ?? Math.random().toString(),
            name: ing.name ?? { en: 'Unknown' },
            category: ing.category ?? { en: 'Other' },
          }))
        );
      }
      setLoading(false);
    };
    fetchIngredients();
  }, []);

  // Suggestions filtrées
  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return [];

    const term = search.toLowerCase().trim();

    return ingredients
      .filter((ing) => {
        const name = translateIngredientName(ing)?.toLowerCase() || '';
        return name.includes(term);
      })
      .slice(0, 8); // limite pour perf + UX
  }, [search, ingredients, translateIngredientName]);

  const handleSuggestionSelect = (ingredient: Ingredient) => {
    dispatch({ type: 'TOGGLE_SELECTED_INGREDIENT', payload: ingredient });
    setSearch(''); // ferme le dropdown
  };

  // Groupement catégories (inchangé)
  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    const category =
      typeof ingredient.category === 'string'
        ? ingredient.category
        : ingredient.category[i18n.language] ?? ingredient.category.en ?? 'Other';

    if (!acc[category]) acc[category] = [];
    acc[category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const getCategoryName = (category: string) => {
    return translateCategoryName({ category }) || 
           t(`ingredientsSection.categories.${category.toLowerCase()}`, { defaultValue: category });
  };

  const handleFindDishes = () => {
    if (!onFindDishes || selectedIngredients.length === 0) return;

    const owned = selectedIngredients.map((ing) => ({
      id: ing.id,
      name: translateIngredientName(ing) || 'Unknown',
      quantity: 1,
      unit: 'piece',
      category:
        typeof ing.category === 'string' ? ing.category : ing.category?.[i18n.language] ?? 'other',
    }));

    onFindDishes(owned);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('ingredientsSection.whatsInKitchen')}</h2>
      <p className="text-gray-600 mb-6">{t('ingredientsSection.whatsInKitchenDesc')}</p>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un ingrédient..."  // ← placeholder statique safe (ajoute la clé plus tard)
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {search.trim() && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((ing) => (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => handleSuggestionSelect(ing)}
                  className={`w-full px-4 py-2.5 text-left hover:bg-gray-100 ${
                    selectedIngredients.some((s) => s.id === ing.id) ? 'bg-green-50 font-medium' : ''
                  }`}
                >
                  {translateIngredientName(ing)}
                </button>
              ))
            ) : (
              <div className="px-4 py-2.5 text-gray-500">Aucun résultat</div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : ingredients.length === 0 ? (
        <p className="text-red-600">{t('common.error')}</p>
      ) : (
        <>
          {Object.entries(groupedIngredients).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-2">{getCategoryName(category)}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {items.map((ingredient) => {
                  const isSelected = selectedIngredients.some((i) => i.id === ingredient.id);
                  return (
                    <button
                      key={ingredient.id}
                      onClick={() =>
                        dispatch({
                          type: 'TOGGLE_SELECTED_INGREDIENT',
                          payload: ingredient,
                        })
                      }
                      className={`px-3 py-2 border rounded-full text-sm transition ${
                        isSelected
                          ? 'bg-green-200 border-green-400'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {translateIngredientName(ingredient)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={handleFindDishes}
            className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedIngredients.length === 0}
          >
            {t('ingredientsSection.findDishes')} ({selectedIngredients.length})
          </button>
        </>
      )}
    </div>
  );
};

export default IngredientSelector;
