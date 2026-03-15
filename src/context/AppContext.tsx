// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { supabase } from "../lib/supabase";
import { Dish, Ingredient, MealPlan, OwnedIngredient } from "../types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type User = {
  id: string;
  email: string;
  name: string;
  location?: string;
  preferences?: string[];       // IDs des types de cuisine préférés
  dislikedIngredients?: string[]; // IDs des ingrédients à exclure
};

type State = {
  user: User | null;
  isLoading: boolean;
  location: string | null;
  selectedDishes: Dish[];
  mealPlan: MealPlan[];
  shoppingList: Ingredient[];
  selectedIngredients: OwnedIngredient[];
};

type Action =
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LOCATION"; payload: string }
  // Plats sélectionnés (menu)
  | { type: "ADD_DISH"; payload: Dish }
  | { type: "REMOVE_DISH"; payload: string }
  | { type: "CLEAR_SELECTED_DISHES" }
  // Planification des repas
  | { type: "ADD_MEAL_PLAN"; payload: MealPlan }
  | { type: "REMOVE_MEAL_PLAN"; payload: string }
  | { type: "SET_MEAL_PLAN"; payload: MealPlan[] }
  // Liste de courses
  | { type: "TOGGLE_INGREDIENT_OWNED"; payload: string }
  // Ingrédients disponibles (UseMyIngredients)
  | { type: "TOGGLE_SELECTED_INGREDIENT"; payload: Ingredient }
  | { type: "SET_SELECTED_INGREDIENTS"; payload: OwnedIngredient[] }
  | { type: "CLEAR_SELECTED_INGREDIENTS" };

// ─────────────────────────────────────────────────────────────
// État initial
// ─────────────────────────────────────────────────────────────

const initialState: State = {
  user: null,
  isLoading: true,
  location: null,
  selectedDishes: [],
  mealPlan: [],
  shoppingList: [],
  selectedIngredients: [],
};

// ─────────────────────────────────────────────────────────────
// Helper : génération de la liste de courses à partir des plats
// Fusionne les ingrédients identiques (même id) en additionnant
// les quantités, et préserve le statut isOwned existant.
// ─────────────────────────────────────────────────────────────

function buildShoppingList(
  dishes: Dish[],
  prevList: Ingredient[]
): Ingredient[] {
  const map = new Map<string, Ingredient>();

  dishes.forEach((dish) => {
    dish.ingredients.forEach((ing) => {
      const key = ing.id;
      if (map.has(key)) {
        const existing = map.get(key)!;
        const existingQty = parseFloat(existing.amount) || 0;
        const newQty = parseFloat(ing.amount) || 0;
        map.set(key, {
          ...existing,
          amount: String(Math.round((existingQty + newQty) * 100) / 100),
        });
      } else {
        const prev = prevList.find((p) => p.id === key);
        map.set(key, {
          ...ing,
          isOwned: prev?.isOwned ?? false,
        });
      }
    });
  });

  return Array.from(map.values());
}

// ─────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────

function reducer(state: State, action: Action): State {
  switch (action.type) {
    // ── Auth ──────────────────────────────────────────────────
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };

    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_LOCATION":
      return { ...state, location: action.payload };

    // ── Plats sélectionnés ────────────────────────────────────
    case "ADD_DISH": {
      // Évite les doublons
      if (state.selectedDishes.some((d) => d.id === action.payload.id)) {
        return state;
      }
      const newDishes = [...state.selectedDishes, action.payload];
      return {
        ...state,
        selectedDishes: newDishes,
        shoppingList: buildShoppingList(newDishes, state.shoppingList),
      };
    }

    case "REMOVE_DISH": {
      const newDishes = state.selectedDishes.filter(
        (d) => d.id !== action.payload
      );
      return {
        ...state,
        selectedDishes: newDishes,
        shoppingList: buildShoppingList(newDishes, state.shoppingList),
      };
    }

    case "CLEAR_SELECTED_DISHES":
      return {
        ...state,
        selectedDishes: [],
        shoppingList: [],
      };

    // ── Planification des repas ───────────────────────────────
    case "ADD_MEAL_PLAN":
      return {
        ...state,
        mealPlan: [...state.mealPlan, action.payload],
      };

    case "REMOVE_MEAL_PLAN":
      return {
        ...state,
        mealPlan: state.mealPlan.filter((m) => m.id !== action.payload),
      };

    case "SET_MEAL_PLAN":
      return {
        ...state,
        mealPlan: action.payload,
      };

    // ── Liste de courses ──────────────────────────────────────
    case "TOGGLE_INGREDIENT_OWNED":
      return {
        ...state,
        shoppingList: state.shoppingList.map((item) =>
          item.id === action.payload
            ? { ...item, isOwned: !item.isOwned }
            : item
        ),
      };

    // ── Ingrédients disponibles (UseMyIngredients) ────────────
    case "TOGGLE_SELECTED_INGREDIENT": {
      const ing = action.payload;
      const exists = state.selectedIngredients.some((i) => i.id === ing.id);

      if (exists) {
        return {
          ...state,
          selectedIngredients: state.selectedIngredients.filter(
            (i) => i.id !== ing.id
          ),
        };
      }

      // Conversion Ingredient → OwnedIngredient
      // Garder le nom multilingue si disponible pour matching multilingue
      const rawName = ing.name as any;
      const resolvedName = typeof rawName === "string"
        ? rawName
        : rawName?.fr ?? rawName?.en ?? rawName?.ar ?? "Unknown";

      const owned: OwnedIngredient = {
        id: ing.id,
        name: resolvedName,
        quantity: parseFloat(ing.amount) || 1,
        unit: ing.unit ?? "",
        category: typeof ing.category === "string" ? ing.category : (ing.category as any)?.fr ?? (ing.category as any)?.en ?? "",
      };

      return {
        ...state,
        selectedIngredients: [...state.selectedIngredients, owned],
      };
    }

    case "SET_SELECTED_INGREDIENTS":
      return {
        ...state,
        selectedIngredients: action.payload,
      };

    case "CLEAR_SELECTED_INGREDIENTS":
      return {
        ...state,
        selectedIngredients: [],
      };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// Helper OAuth : parse les tokens depuis l'URL (compatible
// HashRouter + GitHub Pages).
// Format attendu après redirection Supabase :
//   https://domaine/#/login?access_token=...&refresh_token=...
//   ou  https://domaine/#/login#access_token=...
// ─────────────────────────────────────────────────────────────

function parseOAuthTokensFromUrl(): {
  access_token: string;
  refresh_token: string;
} | null {
  try {
    const fullHash = window.location.hash; // ex: "#/login?access_token=..."
    if (!fullHash.includes("access_token")) return null;

    // Cas 1 : paramètres après "?" dans le hash
    if (fullHash.includes("?")) {
      const params = new URLSearchParams(fullHash.split("?")[1]);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (access_token && refresh_token) return { access_token, refresh_token };
    }

    // Cas 2 : second fragment après "#"  (#/login#access_token=...)
    const parts = fullHash.split("#");
    for (let i = parts.length - 1; i > 0; i--) {
      const params = new URLSearchParams(parts[i]);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (access_token && refresh_token) return { access_token, refresh_token };
    }
  } catch (err) {
    console.error("parseOAuthTokensFromUrl:", err);
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

interface AppContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // ── Étape 1 : traitement OAuth (tokens dans l'URL) ───
        const oauthTokens = parseOAuthTokensFromUrl();

        if (oauthTokens) {
          const { error: sessionError } = await supabase.auth.setSession(
            oauthTokens
          );
          if (sessionError) {
            console.error("Erreur setSession OAuth:", sessionError);
          } else {
            // Nettoie l'URL pour ne pas rejouer le token au rechargement
            window.history.replaceState(
              null,
              "",
              window.location.pathname + "#/"
            );
          }
        }

        // ── Étape 2 : hydratation session normale ────────────
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email ?? "",
            name:
              session.user.user_metadata?.full_name ??
              session.user.email ??
              "Utilisateur",
          };
          dispatch({ type: "SET_USER", payload: userData });

          // Charger les repas futurs depuis Supabase
          const today = new Date().toISOString().split('T')[0];
          const { data: mealData } = await supabase
            .from('meal_plans')
            .select(`
              id, date, meal_type, servings, notes, created_at,
              dishes (
                id, name, image_url, cooking_time, rating,
                calories, servings, tags, difficulty, cuisine_type, cuisineId,
                dish_ingredients (
                  quantity, unit,
                  ingredient:ingredient_id ( id, name, category )
                )
              )
            `)
            .eq('user_id', session.user.id)
            .gte('date', today)
            .order('date', { ascending: true });

          if (mealData && mealData.length > 0) {
            const lang = 'fr';
            const meals: MealPlan[] = mealData.map((row: any) => {
              const dish = row.dishes;
              return {
                id: row.id,
                userId: session.user.id,
                date: row.date,
                mealType: row.meal_type,
                servings: row.servings,
                notes: row.notes ?? undefined,
                createdAt: row.created_at,
                dish: {
                  id: String(dish.id),
                  title: dish.name?.[lang] || dish.name?.en || 'Sans titre',
                  image: dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
                  cuisine: dish.cuisine_type?.[lang] || dish.cuisine_type?.en || '',
                  cuisineId: dish.cuisineId ? String(dish.cuisineId) : null,
                  cookingTime: dish.cooking_time || 30,
                  rating: Number(dish.rating) || 4.5,
                  difficulty: dish.difficulty?.[lang] || dish.difficulty?.en || 'medium',
                  servings: dish.servings || 4,
                  calories: dish.calories || 400,
                  tags: Array.isArray(dish.tags) ? dish.tags : [],
                  ingredients: (dish.dish_ingredients || []).map((di: any) => ({
                    id: String(di.ingredient.id),
                    name: di.ingredient.name?.[lang] || di.ingredient.name?.en || '',
                    category: di.ingredient.category?.[lang] || '',
                    amount: String(di.quantity || 1),
                    unit: di.unit?.[lang] || di.unit?.en || '',
                  })),
                  instructions: [],
                },
              };
            });
            dispatch({ type: 'SET_MEAL_PLAN', payload: meals });
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (err) {
        console.error("Erreur initAuth:", err);
        if (isMounted) dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();

    // ── Listener Supabase (changements d'état auth) ──────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        dispatch({
          type: "SET_USER",
          payload: {
            id: session.user.id,
            email: session.user.email ?? "",
            name:
              session.user.user_metadata?.full_name ??
              session.user.email ??
              "Utilisateur",
          },
        });
      } else if (event === "SIGNED_OUT") {
        dispatch({ type: "LOGOUT" });
      }
    });

    // ── Sécurité anti-blocage : 6 s max pour le chargement ──
    const safetyTimeout = setTimeout(() => {
      if (isMounted) dispatch({ type: "SET_LOADING", payload: false });
    }, 6000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp doit être utilisé à l'intérieur d'un <AppProvider>");
  }
  return ctx;
};
