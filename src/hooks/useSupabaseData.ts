import { useState, useEffect } from 'react';
import { supabase, getDishes, getIngredients } from '../lib/supabase';
import { Dish, Ingredient } from '../types';
import { useTranslation } from 'react-i18next';

export const useSupabaseData = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dishes from Supabase
      const dishesData: any[] = await getDishes(i18n.language);

      // Normalize data
      const transformedDishes: Dish[] = dishesData.map((dish: any) => {
        let difficultyValue = 'Medium';
        if (dish.difficulty) {
          if (typeof dish.difficulty === 'string') {
            difficultyValue = dish.difficulty;
          } else if (typeof dish.difficulty === 'object') {
            difficultyValue =
              dish.difficulty[i18n.language] ||
              dish.difficulty.en ||
              Object.values(dish.difficulty)[0] ||
              'Medium';
          }
        }

        return {
          id: dish.id ? String(dish.id) : Math.random().toString(36).slice(2),
          title: dish.title || dish.name || 'Untitled',
          image:
            dish.image_url ||
            dish.image ||
            (import.meta.env.VITE_SUPABASE_STORAGE_URL
              ? `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/${dish.image}`
              : ''),
          cuisine: dish.cuisine || 'Unknown',
          cuisineId: dish.cuisineId ? String(dish.cuisineId) : null,
          cookingTime: dish.cooking_time || dish.cookingTime || 30,
          rating: dish.rating || 4.5,
          difficulty: difficultyValue,
          servings: dish.servings || 4,
          calories: dish.calories || 400,
          tags: dish.tags || [],
          ingredients: dish.ingredients || [],
          instructions: dish.instructions || [],
          translations: {
            title: dish.name,
            description: dish.description,
            cuisine: dish.cuisine_type,
          },
          instructionTranslations: dish.steps,
          _originalDifficulty: dish.difficulty,
        };
      });

      setDishes(transformedDishes);

      // Fetch ingredients
      const ingredientsData = await getIngredients(i18n.language);
      setIngredients(ingredientsData);
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  return { dishes, ingredients, loading, error, refetch: fetchData };
};

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
