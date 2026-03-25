// src/hooks/useSupabaseData.ts
import { useState, useEffect, useCallback } from 'react';
import { getDishes, getIngredients } from '../lib/supabase';
import { Dish, Ingredient } from '../types';
import { useTranslation } from 'react-i18next';

const CACHE_KEY_DISHES     = 'km_dishes_cache';
const CACHE_KEY_INGREDIENTS = 'km_ingredients_cache';
const CACHE_TTL_MS         = 24 * 60 * 60 * 1000; // 24 heures

// ─────────────────────────────────────────────────────────────
// Helpers cache localStorage
// ─────────────────────────────────────────────────────────────

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts, lang } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return { data, lang } as any;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T, lang: string): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now(), lang }));
  } catch {
    // Quota dépassé — on ignore silencieusement
  }
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export const useSupabaseData = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const { i18n } = useTranslation();

  // CORRIGÉ : normaliser la langue (ex. 'fr-FR' → 'fr')
  const lang = i18n.language.split('-')[0] || 'fr';

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);
        setIsFromCache(false);

        // ── Tentative lecture cache (si pas force refresh) ───
        if (!forceRefresh) {
          const cachedDishes      = readCache<{ data: Dish[]; lang: string }>(CACHE_KEY_DISHES);
          const cachedIngredients = readCache<{ data: Ingredient[]; lang: string }>(CACHE_KEY_INGREDIENTS);

          // Utiliser le cache uniquement si la langue correspond
          if (
            cachedDishes?.lang === lang &&
            cachedIngredients?.lang === lang &&
            (cachedDishes as any).data?.length > 0
          ) {
            setDishes((cachedDishes as any).data);
            setIngredients((cachedIngredients as any).data || []);
            setIsFromCache(true);
            setLoading(false);
            return;
          }
        }

        // ── Fetch depuis Supabase ────────────────────────────
        const rawDishes = await getDishes(lang);

        if (!Array.isArray(rawDishes)) {
          throw new Error('Données plats invalides (pas un tableau)');
        }

        const transformed: Dish[] = rawDishes
          .map((dish: any) => {
            const id = dish.id ? String(dish.id) : null;
            if (!id) {
              console.warn('Plat sans ID valide ignoré:', dish);
              return null;
            }

            // Normalisation difficulty
            let difficulty: Dish['difficulty'] = 'medium';
            if (dish.difficulty) {
              if (typeof dish.difficulty === 'string') {
                difficulty = dish.difficulty.toLowerCase() as Dish['difficulty'];
              } else if (typeof dish.difficulty === 'object') {
                difficulty = (
                  dish.difficulty[lang]?.toLowerCase() ||
                  dish.difficulty.en?.toLowerCase() ||
                  'medium'
                ) as Dish['difficulty'];
              }
            }

            return {
              id,
              title: dish.title || 'Plat sans titre',
              description: dish.description || '',
              image: dish.image_url || dish.image ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
              cuisine: dish.cuisine || 'Inconnue',
              cuisineId: dish.cuisineId ? String(dish.cuisineId) : null,
              cookingTime: Number(dish.cooking_time ?? dish.cookingTime) || 30,
              rating: Number(dish.rating) || 4.5,
              difficulty,
              servings: Number(dish.servings) || 4,
              calories: Number(dish.calories) || 400,
              tags: Array.isArray(dish.tags) ? dish.tags : [],
              ingredients: Array.isArray(dish.ingredients) ? dish.ingredients : [],
              instructions: Array.isArray(dish.instructions) ? dish.instructions : [],
              translations: dish.translations || {},
              instructionTranslations: dish.instructionTranslations || {},
              // Préserver l'ID difficulty pour les filtres dans DishGrid
              difficultyId: dish.difficultyId ? String(dish.difficultyId) : undefined,
            } as Dish;
          })
          .filter((d): d is Dish => d !== null);

        setDishes(transformed);
        writeCache(CACHE_KEY_DISHES, transformed, lang);

        // ── Ingrédients ──────────────────────────────────────
        const ingData = await getIngredients(lang);
        const ingredients = Array.isArray(ingData) ? ingData : [];
        setIngredients(ingredients);
        writeCache(CACHE_KEY_INGREDIENTS, ingredients, lang);

      } catch (err: any) {
        console.error('Erreur chargement Supabase:', err);
        setError(err.message || 'Erreur lors du chargement des données');

        // CORRIGÉ : fallback sur le cache même expiré en cas d'erreur réseau
        try {
          const rawCache = localStorage.getItem(CACHE_KEY_DISHES);
          if (rawCache) {
            const { data } = JSON.parse(rawCache);
            if (Array.isArray(data) && data.length > 0) {
              setDishes(data);
              setIsFromCache(true);
              setError('Données hors ligne (réseau indisponible)');
            }
          }
        } catch {
          // Pas de cache disponible — l'erreur reste affichée
        }
      } finally {
        setLoading(false);
      }
    },
    [lang]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Se relance automatiquement quand la langue change

  return {
    dishes,
    ingredients,
    loading,
    error,
    isFromCache,
    refetch: () => fetchData(true), // Force refresh (ignore cache)
  };
};
