import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { MealPlan } from '../types';

export const useMealPlan = () => {
  const { state, dispatch } = useApp();
  const userId = state.user?.id;

  const loadMealPlans = useCallback(async () => {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('meal_plans')
      .select(`
        id, date, meal_type, servings, notes, created_at,
        dishes (
          id, name, image_url, cooking_time, rating,
          calories, servings, tags, difficulty, cuisine_type, "cuisineId",
          dish_ingredients (
            quantity, unit,
            ingredient:ingredient_id ( id, name, category )
          )
        )
      `)
      .eq('user_id', userId)
      .gte('date', today)
      .order('date', { ascending: true });

    if (error || !data || data.length === 0) return;

    const lang = 'fr';
    const mealPlans: MealPlan[] = data.map((row: any) => {
      const dish = row.dishes;
      return {
        id: row.id,
        userId,
        date: row.date,
        mealType: row.meal_type,
        servings: row.servings,
        notes: row.notes ?? undefined,
        createdAt: row.created_at,
        dish: {
          id: String(dish.id),
          title: dish.name?.[lang] || dish.name?.en || 'Sans titre',
          image: dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
          cuisine: dish.cuisine_type?.[lang] || dish.cuisine_type?.en || '',
          cuisineId: dish['cuisineId'] ? String(dish['cuisineId']) : null,
          cookingTime: dish.cooking_time || 30,
          rating: Number(dish.rating) || 4.5,
          difficulty: dish.difficulty?.[lang] || dish.difficulty?.en || 'medium',
          servings: dish.servings || 4,
          calories: dish.calories || 400,
          tags: Array.isArray(dish.tags) ? dish.tags : [],
          ingredients: (dish.dish_ingredients || []).map((di: any) => ({
            id: String(di.ingredient.id),
            name: di.ingredient.name?.[lang] || di.ingredient.name?.en || '',
            category: di.ingredient.category?.[lang] || '',
            amount: String(di.quantity || 1),
            unit: di.unit?.[lang] || di.unit?.en || '',
          })),
          instructions: [],
        },
      };
    });

    dispatch({ type: 'SET_MEAL_PLAN', payload: mealPlans });
  }, [userId, dispatch]);

  const saveMealPlan = useCallback(async (meal: MealPlan) => {
    if (!userId) return;
    await supabase.from('meal_plans').upsert({
      id: meal.id,
      user_id: userId,
      dish_id: Number(meal.dish.id),
      date: meal.date,
      meal_type: meal.mealType,
      servings: meal.servings,
      notes: meal.notes ?? null,
      created_at: meal.createdAt,
    }, { onConflict: 'id' });
  }, [userId]);

  const deleteMealPlan = useCallback(async (mealId: string, dishId?: string, date?: string) => {
    if (!userId) return;
    // Supprimer par dish_id + date si disponible, sinon par id Supabase
    if (dishId && date) {
      await supabase.from('meal_plans').delete()
        .eq('user_id', userId)
        .eq('dish_id', Number(dishId))
        .eq('date', date);
    } else {
      await supabase.from('meal_plans').delete()
        .eq('id', mealId)
        .eq('user_id', userId);
    }
  }, [userId]);

  return { saveMealPlan, deleteMealPlan, loadMealPlans };
};
