// src/lib/supabase.ts
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
