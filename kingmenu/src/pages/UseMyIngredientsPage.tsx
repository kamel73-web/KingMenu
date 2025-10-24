import React, { useState } from 'react';
import IngredientSelector from '../components/Ingredients/IngredientSelector';
import DishMatchResults from '../components/Ingredients/DishMatchResults';
import { OwnedIngredient, DishMatch } from '../types';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

export default function UseMyIngredientsPage() {
  const { t } = useTranslation();
  const { state } = useApp();
  const [currentStep, setCurrentStep] = useState<'select' | 'results'>('select');
  const [dishMatches, setDishMatches] = useState<DishMatch[]>([]);
  const { dishes, loading, error } = useSupabaseData();

  const calculateDishMatches = (ownedIngredients: OwnedIngredient[]): DishMatch[] => {
    console.log('Calcul des correspondances pour les ingrédients:', ownedIngredients);
    console.log('Plats disponibles:', dishes.map(d => ({
      id: d.id,
      title: d.title,
      ingredients: d.ingredients.map(i => ({ id: i.id, name: i.name })),
    })));
    const matches: DishMatch[] = [];

    dishes.forEach(dish => {
      console.log('Analyse du plat:', dish.title, 'avec ingrédients:', dish.ingredients);
      const availableIngredients = dish.ingredients.filter(dishIngredient => {
        // Comparaison basée sur le nom comme secours temporaire
        const dishIngredientName = typeof dishIngredient.name === 'string' 
          ? dishIngredient.name 
          : dishIngredient.name.fr || dishIngredient.name.en;
        const match = ownedIngredients.some(owned => {
          const ownedName = typeof owned.name === 'string' 
            ? owned.name 
            : owned.name.fr || owned.name.en;
          const match = ownedName.toLowerCase() === dishIngredientName.toLowerCase();
          console.log(`Comparaison: owned.name=${ownedName}, dishIngredient.name=${dishIngredientName}, Match=${match}`);
          return match;
        });
        return match;
      });

      const missingIngredients = dish.ingredients.filter(dishIngredient => {
        const dishIngredientName = typeof dishIngredient.name === 'string' 
          ? dishIngredient.name 
          : dishIngredient.name.fr || dishIngredient.name.en;
        return !ownedIngredients.some(owned => {
          const ownedName = typeof owned.name === 'string' 
            ? owned.name 
            : owned.name.fr || owned.name.en;
          return ownedName.toLowerCase() === dishIngredientName.toLowerCase();
        });
      });

      const compatibilityScore = dish.ingredients.length > 0 
        ? (availableIngredients.length / dish.ingredients.length) * 100 
        : 0;

      console.log(`Plat: ${dish.title}, Score: ${compatibilityScore.toFixed(0)}%, Disponibles:`, availableIngredients, 'Manquants:', missingIngredients);

      if (compatibilityScore >= 30) {
        let matchType: 'perfect' | 'near' | 'creative';
        
        if (compatibilityScore === 100) {
          matchType = 'perfect';
        } else if (compatibilityScore >= 70) {
          matchType = 'near';
        } else {
          matchType = 'creative';
        }

        matches.push({
          dish: {
            ...dish,
            compatibilityScore,
            availableIngredients,
            missingIngredients,
          },
          compatibilityScore,
          matchType,
          availableIngredients,
          missingIngredients,
        });
      }
    });

    console.log('Correspondances finales:', matches.map(m => ({
      title: m.dish.title,
      score: m.compatibilityScore,
      matchType: m.matchType,
      available: m.availableIngredients.map(i => i.name),
      missing: m.missingIngredients.map(i => i.name),
    })));
    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  };

  const handleFindDishes = (ingredients: OwnedIngredient[]) => {
    console.log('Ingrédients sélectionnés:', ingredients);
    const matches = calculateDishMatches(ingredients);
    setDishMatches(matches);
    setCurrentStep('results');
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-red-500">{t('errorLoadingDishes')}: {error.message}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p>{t('loading')}</p>
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
            name: typeof ing.name === 'string' ? ing.name : ing.name.fr || ing.name.en,
          }))}
          onBack={() => setCurrentStep('select')}
        />
      )}
    </div>
  );
}
