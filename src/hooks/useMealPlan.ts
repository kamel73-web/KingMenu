// src/hooks/useMealPlan.ts
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { MealPlan } from '../types';
import { mapSupabaseMealPlan } from '../lib/dishMapper';

// Requête SQL partagée pour les meal_plans avec join dishes complet
const MEAL_PLAN_SELECT = `
  id, date, meal_type, servings, notes, created_at,
  dishes (
    id, name, image_url, cooking_time, rating,
    calories, servings, tags, difficulty, cuisine_type,
    "cuisineId",
    dish_ingredients (
      quantity, unit,
      ingredient:ingredient_id ( id, name, category )
    )
  )
`;

export const useMealPlan = () => {
  const { state, dispatch } = useApp();
  const { i18n } = useTranslation();
  const userId = state.user?.id;

  // CORRIGÉ : utilise i18n.language au lieu de 'fr' hardcodé
  const getLang = () => i18n.language.split('-')[0] || 'fr';

  const loadMealPlans = useCallback(async () => {
    if (!userId) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('meal_plans')
      .select(MEAL_PLAN_SELECT)
      .eq('user_id', userId)
      .gte('date', today)
      .order('date', { ascending: true });

    if (error) {
      console.error('Erreur loadMealPlans:', error);
      return;
    }
    if (!data || data.length === 0) return;

    // CORRIGÉ : utilise le mapper centralisé avec la langue courante
    const lang = getLang();
    const mealPlans: MealPlan[] = data.map((row: any) =>
      mapSupabaseMealPlan(row, userId, lang)
    );

    dispatch({ type: 'SET_MEAL_PLAN', payload: mealPlans });
  }, [userId, dispatch, i18n.language]); // CORRIGÉ : i18n.language dans les dépendances

  const saveMealPlan = useCallback(
    async (meal: MealPlan) => {
      if (!userId) return;
      const { error } = await supabase.from('meal_plans').upsert(
        {
          id: meal.id,
          user_id: userId,
          dish_id: Number(meal.dish.id),
          date: meal.date,
          meal_type: meal.mealType,
          servings: meal.servings,
          notes: meal.notes ?? null,
          created_at: meal.createdAt,
        },
        { onConflict: 'id' }
      );
      if (error) console.error('Erreur saveMealPlan:', error);
    },
    [userId]
  );

  const deleteMealPlan = useCallback(
    async (mealId: string, dishId?: string, date?: string) => {
      if (!userId) return;
      let query = supabase.from('meal_plans').delete().eq('user_id', userId);

      // Supprimer par dish_id + date si disponible, sinon par id Supabase
      if (dishId && date) {
        const { error } = await query
          .eq('dish_id', Number(dishId))
          .eq('date', date);
        if (error) console.error('Erreur deleteMealPlan (by dish+date):', error);
      } else {
        const { error } = await query.eq('id', mealId);
        if (error) console.error('Erreur deleteMealPlan (by id):', error);
      }
    },
    [userId]
  );

  return { saveMealPlan, deleteMealPlan, loadMealPlans };
};
