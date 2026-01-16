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

  // ────────────────────────────────────────────────
  // Recherche & suggestions
  // ────────────────────────────────────────────────

  const filteredSuggestions = useMemo(() => {
    if (search.trim().length < 1) return [];

    const term = search.toLowerCase().trim();

    return ingredients
      .filter((ing) => {
        const name = translateIngredientName(ing);
        return name.toLowerCase().includes(term);
      })
      .slice(0, 10); // limite pour ne pas surcharger l’écran
  }, [search, ingredients, translateIngredientName]);

  const handleSuggestionClick = (ingredient: Ingredient) => {
    dispatch({ type: 'TOGGLE_SELECTED_INGREDIENT', payload: ingredient });
    setSearch(''); // on ferme les suggestions après sélection
  };

  // ────────────────────────────────────────────────
  // Groupement par catégorie (inchangé)
  // ────────────────────────────────────────────────

  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    const categoryKey =
      typeof ingredient.category === 'string'
        ? ingredient.category
        : ingredient.category[i18n.language] ??
          ingredient.category.en ??
          'Other';

    if (!acc[categoryKey]) acc[categoryKey] = [];
    acc[categoryKey].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const getCategoryName = (category: string) => {
    return translateCategoryName({ category }) || t(`ingredientsSection.categories.${category.toLowerCase()}`, category);
  };

  // ────────────────────────────────────────────────
  // Action validation
  // ────────────────────────────────────────────────

  const handleFindDishes = () => {
    if (!onFindDishes || selectedIngredients.length === 0) return;

    const ownedIngredients: OwnedIngredient[] = selectedIngredients.map((ing) => ({
      id: ing.id,
      name: translateIngredientName(ing),
      quantity: 1,
      unit: 'piece',
      category:
        typeof ing.category === 'string'
          ? ing.category
          : ing.category?.[i18n.language] ?? 'other',
    }));

    onFindDishes(ownedIngredients);
  };

  // ────────────────────────────────────────────────
  // Rendu
  // ────────────────────────────────────────────────

  return (
    <div className="p-4 pb-28 min-h-[70vh] relative"> {/* pb-28 → espace pour le bouton fixe */}

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('ingredients.searchPlaceholder') || 'Rechercher un ingrédient...'}
          className={`
            w-full px-4 py-3 rounded-xl border border-gray-300 bg-white
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
            shadow-sm text-base
          `}
          autoComplete="off"
        />

        {/* Suggestions */}
        {search.trim() && (
          <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((ing) => (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => handleSuggestionClick(ing)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors
                    ${selectedIngredients.some((s) => s.id === ing.id) ? 'bg-green-50 font-medium' : ''}
                  `}
                >
                  {translateIngredientName(ing)}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 italic">
                {t('common.noResults') || 'Aucun ingrédient trouvé'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenu principal */}
      {loading ? (
        <p className="text-center text-gray-500">{t('common.loading')}</p>
      ) : ingredients.length === 0 ? (
        <p className="text-center text-red-600">{t('common.error')}</p>
      ) : (
        <>
          {Object.entries(groupedIngredients).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-medium mb-3 capitalize">
                {getCategoryName(category)}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {items.map((ingredient) => {
                  const isSelected = selectedIngredients.some((i) => i.id === ingredient.id);
                  const name = translateIngredientName(ingredient);

                  return (
                    <button
                      key={ingredient.id}
                      onClick={() =>
                        dispatch({
                          type: 'TOGGLE_SELECTED_INGREDIENT',
                          payload: ingredient,
                        })
                      }
                      className={`
                        px-3 py-2.5 border rounded-full text-sm transition-all
                        ${isSelected
                          ? 'bg-green-100 border-green-400 text-green-800 font-medium shadow-sm'
                          : 'bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100'}
                      `}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Bouton validation – fixe en bas */}
          {selectedIngredients.length > 0 && (
            <div className="fixed bottom-4 left-4 right-4 z-30 md:left-auto md:right-8 md:max-w-md">
              <button
                onClick={handleFindDishes}
                className={`
                  w-full py-4 px-6 rounded-xl font-medium text-lg shadow-xl
                  bg-green-600 hover:bg-green-700 active:bg-green-800
                  text-white transition-all transform hover:scale-[1.02] active:scale-98
                  flex items-center justify-center gap-2
                `}
              >
                {t('ingredientsSection.findDishes')} ({selectedIngredients.length})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IngredientSelector;
