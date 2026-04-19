import { useState, useEffect, useCallback } from 'react';
import { getDishes, getIngredients } from '../lib/supabase';
import { Dish, Ingredient } from '../types';
import { useTranslation } from 'react-i18next';

export const useSupabaseData = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ── CORRECTION : fetch en parallèle au lieu de séquentiel ─────────────
      // Avant : getDishes puis getIngredients en séquence (l'un attend l'autre)
      // Après : Promise.all → les deux partent en même temps, gain ~50% de temps
      const [rawDishes, ingData] = await Promise.all([
        getDishes(i18n.language),
        getIngredients(i18n.language),
      ]);
      // ──────────────────────────────────────────────────────────────────────

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

        // Normalisation difficulty (inchangée)
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
          image: dish.image_url
            ? dish.image_url
            : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
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
      }).filter((d): d is Dish => d !== null);

      // Un seul batch de setState → un seul re-render
      setDishes(transformed);
      setIngredients(Array.isArray(ingData) ? ingData : []);

    } catch (err: any) {
      console.error('Erreur chargement Supabase:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { dishes, ingredients, loading, error, refetch: fetchData };
};