// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { supabase } from '../lib/supabase';
import { getUserPreferences } from '../lib/supabase';
import { Dish, Ingredient, MealPlan, OwnedIngredient, User } from '../types';
import { mapSupabaseMealPlan } from '../lib/dishMapper';
import i18n from '../i18n';

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

const LS_SELECTED_DISHES = 'km_selectedDishes';
const LS_SHOPPING_LIST   = 'km_shoppingList';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

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
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'ADD_DISH'; payload: Dish }
  | { type: 'REMOVE_DISH'; payload: string }
  | { type: 'CLEAR_SELECTED_DISHES' }
  | { type: 'ADD_MEAL_PLAN'; payload: MealPlan }
  | { type: 'REMOVE_MEAL_PLAN'; payload: string }
  | { type: 'SET_MEAL_PLAN'; payload: MealPlan[] }
  | { type: 'TOGGLE_INGREDIENT_OWNED'; payload: string }
  | { type: 'TOGGLE_SELECTED_INGREDIENT'; payload: Ingredient }
  | { type: 'SET_SELECTED_INGREDIENTS'; payload: OwnedIngredient[] }
  | { type: 'CLEAR_SELECTED_INGREDIENTS' };

// ─────────────────────────────────────────────────────────────
// Helper localStorage : lire avec fallback sécurisé
// ─────────────────────────────────────────────────────────────

function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ─────────────────────────────────────────────────────────────
// État initial (hydraté depuis localStorage si disponible)
// ─────────────────────────────────────────────────────────────

const initialState: State = {
  user: null,
  isLoading: true,
  location: null,
  selectedDishes: readLocalStorage<Dish[]>(LS_SELECTED_DISHES, []),
  mealPlan: [],
  shoppingList: readLocalStorage<Ingredient[]>(LS_SHOPPING_LIST, []),
  selectedIngredients: [],
};

// ─────────────────────────────────────────────────────────────
// Helper : génération de la liste de courses à partir des plats
// ─────────────────────────────────────────────────────────────

function buildShoppingList(
  dishes: Dish[],
  prevList: Ingredient[]
): Ingredient[] {
  const map = new Map<string, Ingredient>();

  // Indexer la liste précédente pour préserver isOwned
  const prevMap = new Map(prevList.map((p) => [p.id, p]));

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
        // Préserver le statut isOwned depuis la liste précédente
        map.set(key, {
          ...ing,
          isOwned: prevMap.get(key)?.isOwned ?? false,
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
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false };

    case 'LOGOUT':
      // Vider aussi le localStorage au logout
      try {
        localStorage.removeItem(LS_SELECTED_DISHES);
        localStorage.removeItem(LS_SHOPPING_LIST);
      } catch { /* ignore */ }
      return { ...initialState, isLoading: false, selectedDishes: [], shoppingList: [] };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_LOCATION':
      return { ...state, location: action.payload };

    case 'ADD_DISH': {
      if (state.selectedDishes.some((d) => d.id === action.payload.id)) return state;
      const newDishes = [...state.selectedDishes, action.payload];
      const newList = buildShoppingList(newDishes, state.shoppingList);
      // Persister
      try {
        localStorage.setItem(LS_SELECTED_DISHES, JSON.stringify(newDishes));
        localStorage.setItem(LS_SHOPPING_LIST, JSON.stringify(newList));
      } catch { /* ignore quota */ }
      return { ...state, selectedDishes: newDishes, shoppingList: newList };
    }

    case 'REMOVE_DISH': {
      const newDishes = state.selectedDishes.filter((d) => d.id !== action.payload);
      const newList = buildShoppingList(newDishes, state.shoppingList);
      try {
        localStorage.setItem(LS_SELECTED_DISHES, JSON.stringify(newDishes));
        localStorage.setItem(LS_SHOPPING_LIST, JSON.stringify(newList));
      } catch { /* ignore quota */ }
      return { ...state, selectedDishes: newDishes, shoppingList: newList };
    }

    case 'CLEAR_SELECTED_DISHES':
      try {
        localStorage.removeItem(LS_SELECTED_DISHES);
        localStorage.removeItem(LS_SHOPPING_LIST);
      } catch { /* ignore */ }
      return { ...state, selectedDishes: [], shoppingList: [] };

    case 'ADD_MEAL_PLAN':
      return { ...state, mealPlan: [...state.mealPlan, action.payload] };

    case 'REMOVE_MEAL_PLAN':
      return { ...state, mealPlan: state.mealPlan.filter((m) => m.id !== action.payload) };

    case 'SET_MEAL_PLAN':
      return { ...state, mealPlan: action.payload };

    case 'TOGGLE_INGREDIENT_OWNED': {
      const newList = state.shoppingList.map((item) =>
        item.id === action.payload ? { ...item, isOwned: !item.isOwned } : item
      );
      try {
        localStorage.setItem(LS_SHOPPING_LIST, JSON.stringify(newList));
      } catch { /* ignore */ }
      return { ...state, shoppingList: newList };
    }

    case 'TOGGLE_SELECTED_INGREDIENT': {
      const ing = action.payload;
      const exists = state.selectedIngredients.some((i) => i.id === ing.id);
      if (exists) {
        return {
          ...state,
          selectedIngredients: state.selectedIngredients.filter((i) => i.id !== ing.id),
        };
      }
      const rawName = ing.name as any;
      const resolvedName =
        typeof rawName === 'string'
          ? rawName
          : rawName?.fr ?? rawName?.en ?? rawName?.ar ?? 'Unknown';

      const owned: OwnedIngredient = {
        id: ing.id,
        name: resolvedName,
        quantity: parseFloat(ing.amount) || 1,
        unit: ing.unit ?? '',
        category:
          typeof ing.category === 'string'
            ? ing.category
            : (ing.category as any)?.fr ?? (ing.category as any)?.en ?? '',
      };
      return { ...state, selectedIngredients: [...state.selectedIngredients, owned] };
    }

    case 'SET_SELECTED_INGREDIENTS':
      return { ...state, selectedIngredients: action.payload };

    case 'CLEAR_SELECTED_INGREDIENTS':
      return { ...state, selectedIngredients: [] };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// Helper OAuth : parse les tokens depuis l'URL
// ─────────────────────────────────────────────────────────────

function parseOAuthTokensFromUrl(): {
  access_token: string;
  refresh_token: string;
} | null {
  try {
    const fullHash = window.location.hash;
    if (!fullHash.includes('access_token')) return null;

    if (fullHash.includes('?')) {
      const params = new URLSearchParams(fullHash.split('?')[1]);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) return { access_token, refresh_token };
    }

    const parts = fullHash.split('#');
    for (let i = parts.length - 1; i > 0; i--) {
      const params = new URLSearchParams(parts[i]);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) return { access_token, refresh_token };
    }
  } catch (err) {
    console.error('parseOAuthTokensFromUrl:', err);
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
          const { error: sessionError } = await supabase.auth.setSession(oauthTokens);
          if (sessionError) {
            console.error('Erreur setSession OAuth:', sessionError);
          } else {
            // CORRIGÉ : rediriger vers meal-plan au lieu de '/'
            window.history.replaceState(null, '', window.location.pathname + '#/meal-plan');
          }
        }

        // ── Étape 2 : hydratation session normale ────────────
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session?.user) {
          // Récupérer les préférences utilisateur depuis Supabase
          const { data: prefs } = await getUserPreferences(session.user.id);

          const userData: User = {
            id: session.user.id,
            email: session.user.email ?? '',
            name:
              session.user.user_metadata?.full_name ??
              session.user.email ??
              'Utilisateur',
            // CORRIGÉ : charger les préférences depuis la BDD
            preferences: prefs?.preferred_cuisines ?? [],
            dislikedIngredients: prefs?.disliked_ingredients ?? [],
          };

          dispatch({ type: 'SET_USER', payload: userData });

          // CORRIGÉ : la requête meal_plans est déléguée exclusivement
          // à useMealPlan.loadMealPlans() pour éviter la duplication.
          // AppContext ne fait plus cette requête ici.

        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (err) {
        console.error('Erreur initAuth:', err);
        if (isMounted) dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();

    // ── Listener Supabase (changements d'état auth) ──────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        // Recharger les préférences lors d'un changement de session
        const { data: prefs } = await getUserPreferences(session.user.id);

        dispatch({
          type: 'SET_USER',
          payload: {
            id: session.user.id,
            email: session.user.email ?? '',
            name:
              session.user.user_metadata?.full_name ??
              session.user.email ??
              'Utilisateur',
            preferences: prefs?.preferred_cuisines ?? [],
            dislikedIngredients: prefs?.disliked_ingredients ?? [],
          },
        });
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    // ── Sécurité anti-blocage : 6 s max pour le chargement ──
    const safetyTimeout = setTimeout(() => {
      if (isMounted) dispatch({ type: 'SET_LOADING', payload: false });
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

// Export du type User pour compatibilité
export type { User };
