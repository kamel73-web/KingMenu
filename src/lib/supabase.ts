import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Configuration Supabase incomplète. Vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Important pour GitHub Pages + HashRouter
    storageKey: "kingmenu.auth.token", // Optionnel : prefix custom pour éviter conflits
  },
});

// ────────────────────────────────────────────────
// Helpers Auth
// ────────────────────────────────────────────────
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata: any = {}
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// ────────────────────────────────────────────────
// Dishes (avec typage plus strict + pagination possible)
// ────────────────────────────────────────────────
export interface DishFromDB {
  id: number;
  name: Record<string, string>;
  description?: Record<string, string>;
  steps?: Record<string, string[]>;
  cuisine_type_id?: string | number;
  cuisine_type?: Record<string, string>;
  cooking_time?: number;
  calories?: number;
  rating?: number;
  difficulty?: string;
  // ... autres champs
}

export const getDishes = async (language: string = "en", limit = 100, offset = 0) => {
  const { data, error } = await supabase
    .from("dishes")
    .select(`
      *,
      dish_ingredients (
        quantity,
        unit,
        ingredient:ingredient_id (id, name, category)
      )
    `)
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Erreur getDishes:", error);
    throw error;
  }

  return (data || []).map((dish: DishFromDB) => ({
    ...dish,
    id: dish.id,
    title: dish.name?.[language] || dish.name?.en || "Plat sans titre",
    description: dish.description?.[language] || dish.description?.en || "",
    instructions: dish.steps?.[language] || dish.steps?.en || [],
    cuisineId: dish.cuisine_type_id
      ? String(dish.cuisine_type_id)
      : dish.cuisine_type?.id
      ? String(dish.cuisine_type.id)
      : null,
    cuisine:
      dish.cuisine_type?.[language] ||
      dish.cuisine_type?.en ||
      "Cuisine inconnue",
    cookingTime: dish.cooking_time || 30,
    calories: dish.calories || 0,
    rating: dish.rating || 4.0,
    ingredients: (dish.dish_ingredients || []).map((item: any) => ({
      id: String(item.ingredient.id),
      name: item.ingredient.name?.[language] || item.ingredient.name?.en || "Ingrédient inconnu",
      category: item.ingredient.category?.[language] || "",
      amount: String(item.quantity || "1"),
      unit: item.unit?.[language] || item.unit?.en || "pièce",
      isOptional: false,
    })),
  }));
};

// Les autres fonctions (getIngredientsForDish, getIngredients, etc.) restent très bien.
// Vous pouvez les garder telles quelles ou ajouter des try/catch + logs similaires.

export const getUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle(); // ← mieux que .single() si pas de ligne

  if (error) console.error("Erreur preferences:", error);
  return { data, error };
};// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

/* =====================================================
   CONFIGURATION SUPABASE (GitHub Pages + HashRouter)
===================================================== */

// Variables d’environnement (local / CI)
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback sécurisé (autorisé pour clé ANON publique)
const supabaseUrl =
  envUrl ?? "https://vehqvqlbtotljstixklz.supabase.co";

const supabaseAnonKey =
  envAnonKey ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaHF2cWxidG90bGpzdGl4a2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTAxOTEsImV4cCI6MjA2NjE2NjE5MX0.TnSx9bjz8wqo3pBPHaW11YtFcNYHg7Fckuo8z32rG4w";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase configuration is missing");
  throw new Error("Supabase configuration is missing");
}

/* =====================================================
   CLIENT SUPABASE
===================================================== */

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,

    // ✅ OBLIGATOIRE POUR :
    // - GitHub Pages
    // - HashRouter
    // - OAuth Google
    detectSessionInUrl: true,
  },
});

/* =====================================================
   AUTH HELPERS
===================================================== */

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const signInWithEmail = async (
  email: string,
  password: string
) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata?: any
) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

/* =====================================================
   DISHES
===================================================== */

export const getDishes = async (language: string = "en") => {
  const { data, error } = await supabase
    .from("dishes")
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
    console.error("❌ getDishes error:", error);
    throw error;
  }

  return (
    data?.map((dish) => {
      const cuisineId =
        dish.cuisine_type_id ?? dish.cuisine_type?.id ?? null;

      return {
        ...dish,
        title: dish.name?.[language] || dish.name?.en || "Untitled",
        description:
          dish.description?.[language] ||
          dish.description?.en ||
          "",
        instructions:
          dish.steps?.[language] || dish.steps?.en || [],
        cuisineId: cuisineId ? String(cuisineId) : null,
        cuisine:
          dish.cuisine_type?.[language] ||
          dish.cuisine_type?.en ||
          dish.cuisine ||
          "Unknown",
        ingredients:
          dish.dish_ingredients?.map((item) => ({
            id: String(item.ingredient.id),
            name:
              item.ingredient.name?.[language] ||
              item.ingredient.name?.en ||
              "Unknown",
            category:
              item.ingredient.category?.[language] || "",
            amount: item.quantity?.toString() || "1",
            unit: item.unit?.[language] || "piece",
            isOptional: false,
          })) || [],
      };
    }) || []
  );
};

/* =====================================================
   INGREDIENTS
===================================================== */

export const getIngredientsForDish = async (
  dishId: number,
  language: string = "en"
) => {
  const { data, error } = await supabase
    .from("dish_ingredients")
    .select(`
      quantity,
      unit,
      ingredient:ingredient_id (
        id,
        name,
        category
      )
    `)
    .eq("dish_id", dishId);

  if (error) {
    console.error("❌ getIngredientsForDish error:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.ingredient.id,
    name:
      item.ingredient.name?.[language] ||
      item.ingredient.name?.en ||
      "Unknown",
    category:
      item.ingredient.category?.[language] || "",
    amount: item.quantity,
    unit: item.unit?.[language] || "",
  }));
};

export const getIngredients = async (language: string = "en") => {
  const { data, error } = await supabase
    .from("ingredients")
    .select("*");

  if (error) throw error;

  return (
    data?.map((ingredient) => ({
      ...ingredient,
      name:
        ingredient.name?.[language] ||
        ingredient.name?.en ||
        "Unknown ingredient",
    })) || []
  );
};

/* =====================================================
   USER PREFERENCES
===================================================== */

export const getUserPreferences = async (userId: string) => {
  return await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();
};

export const updateUserPreferences = async (
  userId: string,
  preferences: any
) => {
  return await supabase.from("user_preferences").upsert({
    user_id: userId,
    ...preferences,
  });
};

/* =====================================================
   SAVED DISHES
===================================================== */

export const getSavedDishes = async (
  userId: string,
  language: string = "en"
) => {
  const { data, error } = await supabase
    .from("saved_dishes")
    .select(`*, dishes (*)`)
    .eq("user_id", userId);

  if (error) throw error;

  return (
    data?.map((saved) => ({
      ...saved,
      dish: {
        ...saved.dishes,
        title:
          saved.dishes.name?.[language] ||
          saved.dishes.name?.en ||
          "Untitled",
        description:
          saved.dishes.description?.[language] ||
          saved.dishes.description?.en ||
          "",
        instructions:
          saved.dishes.steps?.[language] ||
          saved.dishes.steps?.en ||
          [],
        cuisineId: saved.dishes.cuisine_type_id
          ? String(saved.dishes.cuisine_type_id)
          : saved.dishes.cuisine_type?.id
          ? String(saved.dishes.cuisine_type.id)
          : null,
        cuisine:
          saved.dishes.cuisine_type?.[language] ||
          saved.dishes.cuisine_type?.en ||
          "Unknown",
      },
    })) || []
  );
};

export const saveDish = async (userId: string, dishId: number) => {
  return await supabase.from("saved_dishes").insert({
    user_id: userId,
    dish_id: dishId,
  });
};

export const removeSavedDish = async (
  userId: string,
  dishId: number
) => {
  return await supabase
    .from("saved_dishes")
    .delete()
    .eq("user_id", userId)
    .eq("dish_id", dishId);
};
