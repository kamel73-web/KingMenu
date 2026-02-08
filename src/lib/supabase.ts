// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ────────────────────────────────────────────────
// Configuration (variables d'environnement uniquement)
// ────────────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Configuration Supabase incomplète. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env ou dans les secrets GitHub.'
  );
}

// ────────────────────────────────────────────────
// Création du client Supabase
// ────────────────────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,           // Stocke la session dans localStorage
    autoRefreshToken: true,         // Rafraîchit automatiquement le token
    detectSessionInUrl: true,       // Essentiel pour GitHub Pages + HashRouter + OAuth
    storageKey: 'kingmenu.auth.token', // Préfixe custom pour éviter conflits
  },
});

// ────────────────────────────────────────────────
// Helpers Authentification
// ────────────────────────────────────────────────
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
  return supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

// ────────────────────────────────────────────────
// Helpers Dishes (plats)
// ────────────────────────────────────────────────
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
          category
        )
      )
    `);

  if (error) {
    console.error('Erreur getDishes:', error);
    throw error;
  }

  if (!data) return [];

  return data.map((dish: any) => {
    const cuisineId = dish.cuisine_type_id ?? dish.cuisine_type?.id ?? null;

    return {
      ...dish,
      id: String(dish.id), // Toujours string pour cohérence avec React keys
      title: dish.name?.[language] || dish.name?.en || 'Plat sans titre',
      description: dish.description?.[language] || dish.description?.en || '',
      instructions: dish.steps?.[language] || dish.steps?.en || [],
      cuisineId: cuisineId ? String(cuisineId) : null,
      cuisine:
        dish.cuisine_type?.[language] ||
        dish.cuisine_type?.en ||
        dish.cuisine ||
        'Cuisine inconnue',
      ingredients: (dish.dish_ingredients || []).map((item: any) => ({
        id: String(item.ingredient.id),
        name: item.ingredient.name?.[language] || item.ingredient.name?.en || 'Inconnu',
        category: item.ingredient.category?.[language] || '',
        amount: String(item.quantity || '1'),
        unit: item.unit?.[language] || item.unit?.en || 'pièce',
        isOptional: false,
      })),
    };
  });
};

// ────────────────────────────────────────────────
// Helpers Ingrédients
// ────────────────────────────────────────────────
export const getIngredients = async (language: string = 'en') => {
  const { data, error } = await supabase.from('ingredients').select('*');
  if (error) {
    console.error('Erreur getIngredients:', error);
    throw error;
  }
  return (data || []).map((ing: any) => ({
    ...ing,
    name: ing.name?.[language] || ing.name?.en || 'Ingrédient inconnu',
  }));
};

export const getIngredientsForDish = async (dishId: number | string, language: string = 'en') => {
  const { data, error } = await supabase
    .from('dish_ingredients')
    .select(`
      quantity,
      unit,
      ingredient:ingredient_id (id, name, category)
    `)
    .eq('dish_id', dishId);

  if (error) {
    console.error('Erreur getIngredientsForDish:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: String(item.ingredient.id),
    name: item.ingredient.name?.[language] || item.ingredient.name?.en || 'Inconnu',
    category: item.ingredient.category?.[language] || '',
    amount: String(item.quantity || '1'),
    unit: item.unit?.[language] || item.unit?.en || '',
  }));
};

// ────────────────────────────────────────────────
// Helpers Préférences utilisateur
// ────────────────────────────────────────────────
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

// ────────────────────────────────────────────────
// Helpers Plats favoris (saved_dishes)
// ────────────────────────────────────────────────
export const getSavedDishes = async (userId: string, language: string = 'en') => {
  const { data, error } = await supabase
    .from('saved_dishes')
    .select('*, dishes(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Erreur getSavedDishes:', error);
    return [];
  }

  return (data || []).map((saved: any) => ({
    ...saved,
    dish: {
      ...saved.dishes,
      id: String(saved.dishes.id),
      title: saved.dishes.name?.[language] || saved.dishes.name?.en || 'Sans titre',
      description: saved.dishes.description?.[language] || saved.dishes.description?.en || '',
      instructions: saved.dishes.steps?.[language] || saved.dishes.steps?.en || [],
      cuisineId: saved.dishes.cuisine_type_id
        ? String(saved.dishes.cuisine_type_id)
        : null,
      cuisine: saved.dishes.cuisine_type?.[language] || saved.dishes.cuisine_type?.en || 'Inconnue',
    },
  }));
};

export const saveDish = async (userId: string, dishId: number | string) => {
  return supabase.from('saved_dishes').insert({
    user_id: userId,
    dish_id: Number(dishId), // Assure conversion
  });
};

export const removeSavedDish = async (userId: string, dishId: number | string) => {
  return supabase
    .from('saved_dishes')
    .delete()
    .eq('user_id', userId)
    .eq('dish_id', Number(dishId));
};
