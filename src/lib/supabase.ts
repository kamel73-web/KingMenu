import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,

    // 🔑 CRITIQUE : empêche les tokens d’apparaître dans l’URL
    detectSessionInUrl: false,

    // stockage local propre
    storage: window.localStorage,
  },
});

/* =======================
   AUTH HELPERS
======================= */

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata?: any
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/* =======================
   DATA HELPERS (INCHANGÉS)
======================= */

export const getDishes = async (language: string = "en") => {
  const { data, error } = await supabase.from("dishes").select(`
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
    console.error("Erreur dans getDishes:", error);
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
          dish.description?.[language] || dish.description?.en || "",
        instructions: dish.steps?.[language] || dish.steps?.en || [],
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
            category: item.ingredient.category?.[language] || "",
            amount: item.quantity?.toString() || "1",
            unit: item.unit?.[language] || "piece",
            isOptional: false,
          })) || [],
      };
    }) || []
  );
};
