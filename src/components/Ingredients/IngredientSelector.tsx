import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { OwnedIngredient } from '../../types';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

interface IngredientSelectorProps {
  onFindDishes?: (ingredients: OwnedIngredient[]) => void;
}

const IngredientSelector = ({ onFindDishes }: IngredientSelectorProps) => {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useApp();
  const selectedIngredients = state.selectedIngredients ?? [];
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('ingredients').select('*');
      if (error) {
        console.error('Erreur chargement ingrédients:', error.message);
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

  // Résoudre le nom traduit d'un ingrédient
  const resolveName = (name: any): string => {
    if (typeof name === 'string') return name;
    return name?.[i18n.language] ?? name?.fr ?? name?.en ?? '';
  };

  // Résoudre la catégorie traduite
  const resolveCategory = (category: any): string => {
    if (typeof category === 'string') return category;
    return category?.[i18n.language] ?? category?.fr ?? category?.en ?? 'Other';
  };

  const getCategoryName = (category: string) =>
    t(`ingredientsSection.categories.${category.toLowerCase()}`, category);

  // Filtrage par recherche
  const filteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return ingredients;
    const q = searchTerm.toLowerCase().trim();
    return ingredients.filter(ing =>
      resolveName(ing.name).toLowerCase().includes(q)
    );
  }, [ingredients, searchTerm, i18n.language]);

  // Groupement par catégorie des ingrédients filtrés
  const groupedIngredients = useMemo(() => {
    return filteredIngredients.reduce((acc: Record<string, any[]>, ingredient: any) => {
      const cat = resolveCategory(ingredient.category);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ingredient);
      return acc;
    }, {} as Record<string, any[]>);
  }, [filteredIngredients, i18n.language]);

  const handleFindDishes = () => {
    if (!onFindDishes) return;
    const ownedIngredients = selectedIngredients.map((ing: any) => ({
      id: ing.id,
      name: ing.name,
      quantity: 1,
      unit: 'piece',
      category: ing.category ?? 'other',
    }));
    onFindDishes(ownedIngredients);
  };

  const totalFiltered = filteredIngredients.length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t('ingredientsSection.whatsInKitchen')}
      </h2>
      <p className="text-gray-600 mb-6">
        {t('ingredientsSection.whatsInKitchenDesc')}
      </p>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t('ingredientsSection.searchIngredients', 'Rechercher un ingrédient...')}
          className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-full focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-800"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Sélectionnés */}
      {selectedIngredients.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-orange-700">
              {selectedIngredients.length} {t('ingredientsSection.selectedIngredients', 'ingrédient(s) sélectionné(s)')}
            </span>
            <button
              onClick={() => dispatch({ type: 'CLEAR_SELECTED_INGREDIENTS' })}
              className="text-sm text-orange-500 hover:text-orange-700 underline"
            >
              {t('ingredientsSection.clearAll', 'Tout effacer')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ing: any) => (
              <span
                key={ing.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-full text-sm font-medium"
              >
                {resolveName(ing.name)}
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_SELECTED_INGREDIENT', payload: ing })}
                  className="ml-1 hover:text-orange-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Résultats */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : filteredIngredients.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Aucun ingrédient trouvé pour <strong>"{searchTerm}"</strong></p>
          <button onClick={() => setSearchTerm('')} className="mt-2 text-orange-500 underline text-sm">
            Effacer la recherche
          </button>
        </div>
      ) : (
        <>
          {/* Compteur */}
          {searchTerm && (
            <p className="text-sm text-gray-500 mb-4">
              {totalFiltered} résultat{totalFiltered > 1 ? 's' : ''} pour "<strong>{searchTerm}</strong>"
            </p>
          )}

          {/* Grille par catégorie */}
          {(Object.entries(groupedIngredients) as [string, any[]][]).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
                {getCategoryName(category.toLowerCase())}
                <span className="ml-2 text-xs font-normal text-gray-400">({items.length})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((ingredient: any) => {
                  const isSelected = selectedIngredients.some((i: any) => i.id === ingredient.id);
                  return (
                    <button
                      key={ingredient.id}
                      onClick={() => dispatch({ type: 'TOGGLE_SELECTED_INGREDIENT', payload: ingredient })}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                        isSelected
                          ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {resolveName(ingredient.name)}
                      {isSelected && <span className="ml-1.5">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Bouton trouver des plats */}
          <div className="sticky bottom-4 mt-8">
            <button
              onClick={handleFindDishes}
              disabled={selectedIngredients.length === 0}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              {selectedIngredients.length === 0
                ? t('ingredientsSection.selectAtLeastOne', 'Sélectionnez au moins un ingrédient')
                : `${t('ingredientsSection.findDishes', 'Trouver des plats')} (${selectedIngredients.length} ingrédient${selectedIngredients.length > 1 ? 's' : ''})`
              }
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IngredientSelector;
