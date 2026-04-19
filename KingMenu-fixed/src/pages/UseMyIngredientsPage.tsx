import { useState } from 'react';
import IngredientSelector from '../components/Ingredients/IngredientSelector';
import DishMatchResults from '../components/Ingredients/DishMatchResults';
import { OwnedIngredient, DishMatch, Ingredient } from '../types';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

// Helper : extrait le nom d'un ingrédient qu'il soit string ou Record<lang,string>
function resolveName(name: unknown, lang: string): string {
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object') {
    const obj = name as Record<string, string>;
    return obj[lang] ?? obj['fr'] ?? obj['en'] ?? '';
  }
  return '';
}

export default function UseMyIngredientsPage() {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const [currentStep, setCurrentStep] = useState<'select' | 'results'>('select');
  const [dishMatches, setDishMatches] = useState<DishMatch[]>([]);
  const { dishes, loading, error } = useSupabaseData();

  const calculateDishMatches = (ownedIngredients: OwnedIngredient[]): DishMatch[] => {
    const lang = i18n.language;
    const matches: DishMatch[] = [];

    // Ensemble des IDs possédés pour comparaison rapide
    const ownedIds = new Set(ownedIngredients.map(o => String(o.id)));
    // Noms possédés en minuscules pour fallback si IDs absents
    const ownedNames = new Set(
      ownedIngredients.map(o => resolveName(o.name, lang).toLowerCase().trim())
    );

    const ingredientMatches = (dishIngredient: Ingredient): boolean => {
      // 1. Comparaison par ID (plus fiable)
      if (ownedIds.has(String(dishIngredient.id))) return true;
      // 2. Fallback : comparaison par nom traduit
      const dishName = resolveName(dishIngredient.name, lang).toLowerCase().trim();
      if (ownedNames.has(dishName)) return true;
      // 3. Fallback partiel : le nom possédé est contenu dans le nom du plat ou inversement
      for (const ownedName of ownedNames) {
        if (ownedName.length > 2 && (dishName.includes(ownedName) || ownedName.includes(dishName))) {
          return true;
        }
      }
      return false;
    };

    dishes.forEach(dish => {
      const availableIngredients: Ingredient[] = dish.ingredients.filter(ingredientMatches);
      const missingIngredients: Ingredient[] = dish.ingredients.filter(i => !ingredientMatches(i));

      const compatibilityScore = dish.ingredients.length > 0
        ? (availableIngredients.length / dish.ingredients.length) * 100
        : 0;

      if (compatibilityScore >= 30) {
        const matchType: 'perfect' | 'near' | 'creative' =
          compatibilityScore === 100 ? 'perfect' :
          compatibilityScore >= 70  ? 'near'    : 'creative';

        matches.push({
          dish: { ...dish, compatibilityScore, availableIngredients, missingIngredients },
          compatibilityScore,
          matchType,
          availableIngredients,
          missingIngredients,
        });
      }
    });

    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  };

  const handleFindDishes = (ingredients: OwnedIngredient[]) => {
    const matches = calculateDishMatches(ingredients);
    setDishMatches(matches);
    setCurrentStep('results');
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-red-500">{t('errorLoadingDishes')}: {String(error)}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {currentStep === 'select' ? (
        <IngredientSelector onFindDishes={handleFindDishes} />
      ) : (
        <DishMatchResults
          matches={dishMatches}
          ownedIngredients={state.selectedIngredients.map(ing => ({
            id: ing.id,
            name: resolveName(ing.name, i18n.language),
            quantity: ing.quantity ?? 1,
            unit: ing.unit ?? '',
            category: ing.category ?? '',
          }))}
          onBack={() => setCurrentStep('select')}
        />
      )}
    </div>
  );
}
