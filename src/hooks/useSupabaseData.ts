import { useState, useEffect, useCallback } from 'react';
import { supabase, getDishes, getIngredients } from '../lib/supabase';
import { Dish, Ingredient } from '../types';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext'; // ← pour accéder aux préférences utilisateur si besoin

export const useSupabaseData = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const { state: { user } } = useApp(); // Optionnel : pour refetch sur changement de prefs

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupération des plats
      const rawDishes = await getDishes(i18n.language);

      if (!Array.isArray(rawDishes)) {
        throw new Error('Données plats invalides (pas un tableau)');
      }

      const transformed: Dish[] = rawDishes.map((dish: any) => {
        // Sécurité sur ID (pas d'aléatoire !)
        const id = dish.id ? String(dish.id) : null;
        if (!id) {
          console.warn('Plat sans ID valide ignoré:', dish);
          return null;
        }

        // Normalisation difficulty (simplifiée)
        let difficulty = 'medium';
        if (dish.difficulty) {
          if (typeof dish.difficulty === 'string') {
            difficulty = dish.difficulty.toLowerCase();
          } else if (typeof dish.difficulty === 'object') {
            difficulty =
              dish.difficulty[i18n.language]?.toLowerCase() ||
              dish.difficulty.en?.toLowerCase() ||
              'medium';
          }
        }

        return {
          id,
          title: dish.title || 'Plat sans titre',
          image: dish.image
            ? `${dish.image}?width=600&quality=80&format=webp` // ← optimisation image
            : '/placeholder-dish.jpg',
          cuisine: dish.cuisine || 'Inconnue',
          cuisineId: dish.cuisineId ? String(dish.cuisineId) : null,
          cookingTime: Number(dish.cookingTime) || 30,
          rating: Number(dish.rating) || 4.5,
          difficulty,
          servings: Number(dish.servings) || 4,
          calories: Number(dish.calories) || 400,
          tags: Array.isArray(dish.tags) ? dish.tags : [],
          ingredients: Array.isArray(dish.ingredients) ? dish.ingredients : [],
          instructions: Array.isArray(dish.instructions) ? dish.instructions : [],
          translations: dish.translations || {},
          instructionTranslations: dish.instructionTranslations || {},
          _originalDifficulty: dish.difficulty,
        } as Dish;
      }).filter((d): d is Dish => d !== null); // filtre les plats invalides

      setDishes(transformed);

      // Ingrédients
      const ingData = await getIngredients(i18n.language);
      setIngredients(Array.isArray(ingData) ? ingData : []);

    } catch (err: any) {
      console.error('Erreur chargement Supabase:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [i18n.language]); // Dépendance : langue uniquement (ou + user.preferences si besoin)

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { dishes, ingredients, loading, error, refetch: fetchData };
};
