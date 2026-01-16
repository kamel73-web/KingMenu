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
  const [search, setSearch] = useState(''); // ← AJOUTÉ

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('ingredients').select('*');
      if (error) {
        console.error('Erreur de chargement des ingrédients:', error.message);
      } else if (data) {
        console.log('Ingrédients chargés depuis Supabase:', data);
        setIngredients(
          data.map((ing: any) => ({
            ...ing,
            id: ing.id?.toString() ?? Math.random().toString(), // fallback id
            name: ing.name ?? { en: 'Unknown' },
            category: ing.category ?? { en: 'Other' },
          }))
        );
      }
      setLoading(false);
    };
    fetchIngredients();
  }, []);

  // AJOUTÉ : calcul du groupement (déplacé avant le filtre pour éviter crash)
  const groupedIngredients = useMemo(() => {
    return ingredients.reduce((acc, ingredient) => {
      const category =
        typeof ingredient.category === 'string'
          ? ingredient.category
          : ingredient.category[i18n.language] ??
            ingredient.category.en ??
            'Other';

      if (!acc[category]) acc[category] = [];
      acc[category].push(ingredient);
      return acc;
    }, {} as Record<string, Ingredient[]>);
  }, [ingredients, i18n.language]);

  // AJOUTÉ : version filtrée selon la recherche
  const displayedGroupedIngredients = useMemo(() => {
    if (!search.trim()) {
      return groupedIngredients;
    }

    const term = search.toLowerCase().trim();
    const result: Record<string, Ingredient[]> = {};

    Object.entries(groupedIngredients).forEach(([category, items]) => {
      const filteredItems = items.filter((ing) => {
        const name = translateIngredientName(ing)?.toLowerCase() || '';
        return name.includes(term);
      });

      if (filteredItems.length > 0) {
        result[category] = filteredItems;
      }
    });

    return result;
  }, [search, groupedIngredients, translateIngredientName]);

  const getCategoryName = (category: string) => {
    return translateCategoryName({ category }) ||
           t(`ingredientsSection.categories.${category.toLowerCase()}`, category);
  };

  const handleFindDishes = () => {
    if (onFindDishes) {
      const ownedIngredients = selectedIngredients.map((ing) => ({
        id: ing.id,
        name:
          typeof ing.name === 'string'
            ? ing.name
            : ing.name?.[i18n.language] ?? ing.name?.en ?? 'Unknown',
        quantity: 1,
        unit: 'piece',
        category:
          typeof ing.category === 'string'
            ? ing.category
            : ing.category?.[i18n.language] ?? 'other',
      }));
      console.log('Ingrédients envoyés à onFindDishes:', ownedIngredients);
      onFindDishes(ownedIngredients);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('ingredientsSection.whatsInKitchen')}</h2>
      <p className="text-gray-600 mb-6">{t('ingredientsSection.whatsInKitchenDesc')}</p>

      {/* AJOUTÉ : barre de recherche */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un ingrédient..."
        className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : ingredients.length === 0 ? (
        <p>{t('common.error')}</p>
      ) : (
        <>
          {Object.entries(displayedGroupedIngredients).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-2">
                {getCategoryName(category.toLowerCase())}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {items.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    onClick={() =>
                      dispatch({
                        type: 'TOGGLE_SELECTED_INGREDIENT',
                        payload: ingredient,
                      })
                    }
                    className={`px-3 py-2 border rounded-full text-sm transition ${
                      selectedIngredients.some((i) => i.id === ingredient.id)
                        ? 'bg-green-200 border-green-400'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {typeof ingredient.name === 'string'
                      ? ingredient.name
                      : ingredient.name?.[i18n.language] ??
                        ingredient.name?.en ??
                        t('common.unknown', 'Unknown')}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleFindDishes}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-body font-medium"
            disabled={selectedIngredients.length === 0}
          >
            {t('ingredientsSection.findDishes')}
          </button>
        </>
      )}
    </div>
  );
};

export default IngredientSelector;
