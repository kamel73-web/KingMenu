import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign in with email/password
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Helper function to sign up with email/password
export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Helper function to get dishes with translations and ingredients
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
    console.error('Erreur dans getDishes:', error);
    throw error;
  }

  // Transform the data to extract the correct language and include ingredients
  return data?.map(dish => {
    // Attempt to derive a stable cuisineId:
    // priority: dish.cuisine_type_id (explicit FK) -> dish.cuisine_type.id -> null
    const cuisineId = dish.cuisine_type_id ?? dish.cuisine_type?.id ?? null;

    return {
      ...dish,
      // keep original fields but add normalized ones:
      title: dish.name?.[language] || dish.name?.en || 'Untitled',
      description: dish.description?.[language] || dish.description?.en || '',
      instructions: dish.steps?.[language] || dish.steps?.en || [],
      cuisineId: cuisineId ? String(cuisineId) : null, // stable id for logic
      // translated display name (for UI)
      cuisine: dish.cuisine_type?.[language] || dish.cuisine_type?.en || dish.cuisine || 'Unknown',
      ingredients: dish.dish_ingredients?.map(item => ({
        id: String(item.ingredient.id),
        name: item.ingredient.name?.[language] || item.ingredient.name?.en || 'Unknown',
        category: item.ingredient.category?.[language] || '',
        amount: item.quantity?.toString() || '1',
        unit: item.unit?.[language] || 'piece',
        isOptional: false
      })) || []
    };
  }) || [];
};

// Helper function to get ingredients for a specific dish with debugging logs
export const getIngredientsForDish = async (dishId: number, language: string = 'en') => {
  console.log('Appel de getIngredientsForDish avec dishId:', dishId, 'et langue:', language);
  const { data, error } = await supabase
    .from('dish_ingredients')
    .select(`
      quantity,
      unit,
      ingredient:ingredient_id (
        id,
        name,
        category
      )
    `)
    .eq('dish_id', dishId);

  console.log('Données brutes de dish_ingredients:', data);
  console.log('Erreur:', error);

  if (error) {
    console.error('Erreur lors de la récupération des ingrédients:', error);
    return [];
  }

  const transformedData = data.map(item => ({
    id: item.ingredient.id,
    name: item.ingredient.name?.[language] || item.ingredient.name?.en || 'Unknown',
    category: item.ingredient.category?.[language] || '',
    amount: item.quantity,
    unit: item.unit?.[language] || ''
  }));

  console.log('Données transformées:', transformedData);
  return transformedData;
};

// Helper function to get ingredients with translations
export const getIngredients = async (language: string = 'en') => {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*');

  if (error) throw error;

  return data?.map(ingredient => ({
    ...ingredient,
    name: ingredient.name?.[language] || ingredient.name?.en || 'Unknown ingredient'
  })) || [];
};

// Helper function to get user preferences
export const getUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
};

// Helper function to update user preferences
export const updateUserPreferences = async (userId: string, preferences: any) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      ...preferences
    });

  return { data, error };
};

// Helper function to get user's saved dishes
export const getSavedDishes = async (userId: string, language: string = 'en') => {
  const { data, error } = await supabase
    .from('saved_dishes')
    .select(`
      *,
      dishes (*)
    `)
    .eq('user_id', userId);

  if (error) throw error;

  return data?.map(saved => ({
    ...saved,
    dish: {
      ...saved.dishes,
      title: saved.dishes.name?.[language] || saved.dishes.name?.en || 'Untitled',
      description: saved.dishes.description?.[language] || saved.dishes.description?.en || '',
      instructions: saved.dishes.steps?.[language] || saved.dishes.steps?.en || [],
      cuisineId: saved.dishes.cuisine_type_id ? String(saved.dishes.cuisine_type_id) : (saved.dishes.cuisine_type?.id ? String(saved.dishes.cuisine_type.id) : null),
      cuisine: saved.dishes.cuisine_type?.[language] || saved.dishes.cuisine_type?.en || 'Unknown'
    }
  })) || [];
};

// Helper function to save a dish
export const saveDish = async (userId: string, dishId: number) => {
  const { data, error } = await supabase
    .from('saved_dishes')
    .insert({
      user_id: userId,
      dish_id: dishId
    });

  return { data, error };
};

// Helper function to remove a saved dish
export const removeSavedDish = async (userId: string, dishId: number) => {
  const { error } = await supabase
    .from('saved_dishes')
    .delete()
    .eq('user_id', userId)
    .eq('dish_id', dishId);

  return { error };
};
