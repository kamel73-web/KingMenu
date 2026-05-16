import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Configuration Supabase incomplète.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: 'kingmenu.auth.token',
  },
});

function resolveJsonb(field: any, language: string, fallback = ''): string {
  if (!field) return fallback;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed[language] || parsed['en'] || fallback;
      }
    } catch {
      return field || fallback;
    }
  }
  if (typeof field === 'object') {
    return field[language] || field['en'] || fallback;
  }
  return fallback;
}

function resolveJsonbArray(field: any, language: string): string[] {
  if (!field) return [];
  let parsed = field;
  if (typeof field === 'string') {
    try { parsed = JSON.parse(field); } catch { return []; }
  }
  if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
    const steps = parsed[language] || parsed['en'] || parsed['fr'] || [];
    return Array.isArray(steps) ? steps : [];
  }
  if (Array.isArray(parsed)) return parsed;
  return [];
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) console.error('getCurrentUser error:', error);
  return user ?? null;
};

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) console.error('getCurrentSession error:', error);
  return session ?? null;
};

export const signInWithEmail = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata: Record<string, any> = {}
) => {
  return supabase.auth.signUp({ email, password, options: { data: metadata } });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getDishes = async (language: string = 'en') => {
  const { data, error } = await supabase
    .from('dishes')
    .select(`
      *,
      dish_ingredients (
        quantity,
        unit,
        ingredient:ingredient_id (
          id,
          name,
          category,
          no_measure
        )
      )
    `)
    .order('updated_at', { ascending: false });

  if (error) { console.error('Erreur getDishes:', error); throw error; }
  if (!data) return [];

  return data.map((dish: any) => {
    const cuisineId = dish.cuisine_type_id ?? dish.cuisine_type?.id ?? null;
    return {
      ...dish,
      id: String(dish.id),
      isPremium: dish["is_premium"] ?? false,
      title: resolveJsonb(dish.name, language, 'Plat sans titre'),
      description: resolveJsonb(dish.description, language, ''),
      instructions: resolveJsonbArray(dish.steps, language),
      cuisineId: cuisineId ? String(cuisineId) : null,
      cuisine: dish.cuisine_type?.[language] || dish.cuisine_type?.en || dish.cuisine || 'Cuisine inconnue',
      ingredients: (dish.dish_ingredients || []).map((item: any) => ({
        id: String(item.ingredient.id),
        name: resolveJsonb(item.ingredient.name, language, 'Inconnu'),
        category: resolveJsonb(item.ingredient.category, language, ''),
        amount: item.ingredient?.no_measure ? '' : String(item.quantity || '1'),
        unit: item.ingredient?.no_measure ? '' : resolveJsonb(item.unit, language, ''),
        isOptional: false,
        noMeasure: item.ingredient?.no_measure || false,
      })),
    };
  });
};

export const getDishesByIds = async (ids: string[], language: string = 'en') => {
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from('dishes')
    .select(`
      *,
      dish_ingredients (
        quantity,
        unit,
        ingredient:ingredient_id (
          id,
          name,
          category,
          no_measure
        )
      )
    `)
    .in('id', ids.map(Number));

  if (error) { console.error('Erreur getDishesByIds:', error); return []; }
  if (!data) return [];

  return data.map((dish: any) => {
    const cuisineId = dish.cuisine_type_id ?? dish.cuisine_type?.id ?? null;
    return {
      ...dish,
      id: String(dish.id),
      isPremium: dish["is_premium"] ?? false,
      title: resolveJsonb(dish.name, language, 'Plat sans titre'),
      description: resolveJsonb(dish.description, language, ''),
      instructions: resolveJsonbArray(dish.steps, language),
      difficulty: resolveJsonb(dish.difficulty, language, 'medium'),
      cuisineId: cuisineId ? String(cuisineId) : null,
      cuisine: dish.cuisine_type?.[language] || dish.cuisine_type?.en || dish.cuisine || 'Cuisine inconnue',
      ingredients: (dish.dish_ingredients || []).map((item: any) => ({
        id: String(item.ingredient.id),
        name: resolveJsonb(item.ingredient.name, language, 'Inconnu'),
        category: resolveJsonb(item.ingredient.category, language, ''),
        amount: item.ingredient?.no_measure ? '' : String(item.quantity || '1'),
        unit: item.ingredient?.no_measure ? '' : resolveJsonb(item.unit, language, ''),
        isOptional: false,
        noMeasure: item.ingredient?.no_measure || false,
      })),
    };
  });
};

export const getIngredients = async (language: string = 'en') => {
  const { data, error } = await supabase.from('ingredients').select('*');
  if (error) { console.error('Erreur getIngredients:', error); throw error; }
  return (data || []).map((ing: any) => ({
    ...ing,
    name: resolveJsonb(ing.name, language, 'Ingrédient inconnu'),
    category: resolveJsonb(ing.category, language, ''),
  }));
};

export const getIngredientsForDish = async (dishId: number | string, language: string = 'en') => {
  const { data, error } = await supabase
    .from('dish_ingredients')
    .select(`quantity, unit, ingredient:ingredient_id (id, name, category, no_measure)`)
    .eq('dish_id', dishId);

  if (error) { console.error('Erreur getIngredientsForDish:', error); return []; }

  return (data || []).map((item: any) => ({
    id: String(item.ingredient.id),
    name: resolveJsonb(item.ingredient.name, language, 'Inconnu'),
    category: resolveJsonb(item.ingredient.category, language, ''),
    amount: item.ingredient?.no_measure ? '' : String(item.quantity || '1'),
    unit: item.ingredient?.no_measure ? '' : resolveJsonb(item.unit, language, ''),
    noMeasure: item.ingredient?.no_measure || false,
  }));
};

export const getUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) console.error('Erreur getUserPreferences:', error);
  return { data, error };
};

export const updateUserPreferences = async (userId: string, preferences: any) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({ user_id: userId, ...preferences }, { onConflict: 'user_id' });
  if (error) console.error('Erreur updateUserPreferences:', error);
  return { data, error };
};

export const getSavedDishes = async (userId: string, language: string = 'en') => {
  const { data, error } = await supabase
    .from('saved_dishes')
    .select('*, dishes(*)')
    .eq('user_id', userId);

  if (error) { console.error('Erreur getSavedDishes:', error); return []; }

  return (data || []).map((saved: any) => ({
    ...saved,
    dish: {
      ...saved.dishes,
      id: String(saved.dishes.id),
      title: resolveJsonb(saved.dishes.name, language, 'Sans titre'),
      description: resolveJsonb(saved.dishes.description, language, ''),
      instructions: resolveJsonbArray(saved.dishes.steps, language),
      cuisineId: saved.dishes.cuisine_type_id ? String(saved.dishes.cuisine_type_id) : null,
      cuisine: resolveJsonb(saved.dishes.cuisine_type, language, 'Inconnue'),
    },
  }));
};

export const saveDish = async (userId: string, dishId: number | string) => {
  return supabase.from('saved_dishes').insert({ user_id: userId, dish_id: Number(dishId) });
};

export const removeSavedDish = async (userId: string, dishId: number | string) => {
  return supabase
    .from('saved_dishes')
    .delete()
    .eq('user_id', userId)
    .eq('dish_id', Number(dishId));
};