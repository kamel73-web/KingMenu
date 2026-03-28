// src/lib/dishMapper.ts
// ─────────────────────────────────────────────────────────────
// Utilitaire centralisé pour transformer les données brutes
// Supabase en objets Dish typés.
// Élimine la duplication entre AppContext.tsx et useMealPlan.ts
// ─────────────────────────────────────────────────────────────

import { Dish, Ingredient } from '../types';

export const DEFAULT_DISH_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';

/**
 * Normalise une valeur de difficulté (string ou objet i18n) en string minuscule.
 */
export function normalizeDifficulty(
  difficulty: any,
  lang: string
): 'easy' | 'medium' | 'hard' {
  if (!difficulty) return 'medium';
  if (typeof difficulty === 'string') {
    return difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
  }
  if (typeof difficulty === 'object') {
    const val =
      difficulty[lang]?.toLowerCase() ||
      difficulty.en?.toLowerCase() ||
      difficulty.fr?.toLowerCase() ||
      'medium';
    return val as 'easy' | 'medium' | 'hard';
  }
  return 'medium';
}

/**
 * Transforme un enregistrement dish_ingredients brut Supabase
 * en tableau d'Ingredient typé.
 */
export function mapDishIngredients(
  dishIngredients: any[],
  lang: string
): Ingredient[] {
  return (dishIngredients || []).map((di: any) => ({
    id: String(di.ingredient?.id ?? di.id ?? ''),
    name:
      di.ingredient?.name?.[lang] ||
      di.ingredient?.name?.en ||
      di.ingredient?.name?.fr ||
      di.name ||
      '',
    category:
      di.ingredient?.category?.[lang] ||
      di.ingredient?.category?.en ||
      di.ingredient?.category?.fr ||
      di.category ||
      '',
    amount: String(di.quantity ?? di.amount ?? 1),
    unit:
      di.unit?.[lang] ||
      di.unit?.en ||
      di.unit?.fr ||
      (typeof di.unit === 'string' ? di.unit : '') ||
      '',
    isOwned: false,
    isOptional: di.is_optional ?? false,
  }));
}

/**
 * Transforme un enregistrement dishes brut Supabase en objet Dish typé.
 * Utilisable depuis AppContext, useMealPlan, useSupabaseData, etc.
 */
export function mapSupabaseDishToModel(row: any, lang: string): Dish {
  const dish = row.dishes ?? row; // Supporte les deux formes JOIN et directe

  return {
    id: String(dish.id),
    title:
      dish.name?.[lang] || dish.name?.en || dish.name?.fr || dish.title || 'Sans titre',
    image: dish.image_url || dish.image || DEFAULT_DISH_IMAGE,
    cuisine:
      dish.cuisine_type?.[lang] ||
      dish.cuisine_type?.en ||
      dish.cuisine_type?.fr ||
      dish.cuisine ||
      '',
    cuisineId: dish.cuisineId
      ? String(dish.cuisineId)
      : dish.cuisine_type_id
      ? String(dish.cuisine_type_id)
      : null,
    cookingTime: Number(dish.cooking_time ?? dish.cookingTime) || 30,
    rating: Number(dish.rating) || 4.5,
    difficulty: normalizeDifficulty(dish.difficulty, lang),
    servings: Number(dish.servings) || 4,
    calories: Number(dish.calories) || 400,
    tags: Array.isArray(dish.tags) ? dish.tags : [],
    ingredients: mapDishIngredients(dish.dish_ingredients || [], lang),
    instructions:
      dish.steps?.[lang] ||
      dish.steps?.en ||
      dish.steps?.fr ||
      dish.instructions ||
      [],
    translations: dish.translations || {},
    instructionTranslations: dish.instructionTranslations || {},
  };
}

/**
 * Transforme un enregistrement meal_plans brut Supabase
 * (avec JOIN dishes) en objet MealPlan typé.
 */
export function mapSupabaseMealPlan(row: any, userId: string, lang: string) {
  return {
    id: String(row.id),
    userId,
    date: row.date,
    mealType: row.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    servings: Number(row.servings) || 1,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    dish: mapSupabaseDishToModel(row.dishes ?? row, lang),
  };
}
