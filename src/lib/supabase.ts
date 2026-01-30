// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

/**
 * ⚠️ IMPORTANT POUR GITHUB PAGES
 * Les variables doivent être disponibles AU BUILD.
 * En prod GitHub Pages, on prévoit un fallback sécurisé.
 */

// 🔐 1️⃣ Variables d’environnement (local / CI)
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔐 2️⃣ FALLBACK (obligatoire pour éviter undefined en prod)
const supabaseUrl =
  envUrl || "https://vehqvqlbtotljstixklz.supabase.co";

const supabaseAnonKey =
  envAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaHF2cWxidG90bGpzdGl4a2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTAxOTEsImV4cCI6MjA2NjE2NjE5MX0.TnSx9bjz8wqo3pBPHaW11YtFcNYHg7Fckuo8z32rG4w";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase configuration is missing");
}

/**
 * ✅ CLIENT SUPABASE
 * - persistSession: garde la session après refresh
 * - autoRefreshToken: renouvelle le token
 * - detectSessionInUrl: FALSE pour GitHub Pages + HashRouter
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

/* =====================================================
   AUTH HELPERS
===================================================== */

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
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
   DATA HELPERS
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

export const getUserPreferences = async (userId: string) => {
  return await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();
};

export const updateUserPreferences = async (
 
