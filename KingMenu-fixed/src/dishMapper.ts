import { Dish, Ingredient } from './types';

export const DEFAULT_DISH_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';

export function normalizeDifficulty(
  difficulty: any,
  lang: string
): 'Easy' | 'Medium' | 'Hard' {
  if (!difficulty) return 'Medium';
  const raw =
    typeof difficulty === 'string'
      ? difficulty
      : difficulty[lang] || difficulty.en || difficulty.fr || 'Medium';
  const lower = raw.toLowerCase();
  if (lower === 'easy' || lower === 'facile' || lower === 'fácil' || lower === 'facile') return 'Easy';
  if (lower === 'hard' || lower === 'difficile' || lower === 'difícil') return 'Hard';
  return 'Medium';
}

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

export function mapSupabaseDishToModel(row: any, lang: string): Dish {
  const dish = row.dishes ?? row;
  return {
    id: String(dish.id),
    title:
      dish.name?.[lang] ||
      dish.name?.en ||
      dish.name?.fr ||
      dish.title ||
      'Sans titre',
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
