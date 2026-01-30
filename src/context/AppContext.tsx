import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseData';
import { User, Dish, Ingredient, OwnedIngredient, MealPlan } from '../types';

/* =========================
   Types
========================= */

interface AppState {
  user: User | null;
  selectedDishes: Dish[];
  shoppingList: Ingredient[];
  mealPlan: MealPlan[];
  isLoading: boolean;
  selectedIngredients: Ingredient[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_DISH'; payload: Dish }
  | { type: 'REMOVE_DISH'; payload: string }
  | { type: 'UPDATE_SHOPPING_LIST'; payload: Ingredient[] }
  | { type: 'TOGGLE_INGREDIENT_OWNED'; payload: string }
  | { type: 'UPDATE_OWNED_INGREDIENTS'; payload: OwnedIngredient[] }
  | { type: 'CLEAR_SELECTED_DISHES' }
  | { type: 'ADD_MEAL_PLAN'; payload: MealPlan }
  | { type: 'REMOVE_MEAL_PLAN'; payload: string }
  | { type: 'UPDATE_MEAL_PLAN'; payload: MealPlan }
  | { type: 'SET_MEAL_PLAN'; payload: MealPlan[] }
  | { type: 'TOGGLE_SELECTED_INGREDIENT'; payload: Ingredient };

/* =========================
   Initial State
========================= */

const initialState: AppState = {
  user: null,
  selectedDishes: [],
  shoppingList: [],
  mealPlan: [],
  isLoading: true, // 🔑 CRITIQUE : TRUE au démarrage
  selectedIngredients: [],
};

/* =========================
   Context
========================= */

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

/* =========================
   Reducer
========================= */

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'ADD_DISH': {
      const dishToAdd = {
        ...action.payload,
        ingredients: action.payload.ingredients.map(ingredient => ({
          ...ingredient,
          id:
            ingredient.id ||
            `${action.payload.id}-${ingredient.name
              .toLowerCase()
              .replace(/\s+/g, '-')}`,
          isOwned: false,
        })),
      };

      const selectedDishes = [...state.selectedDishes, dishToAdd];
      return {
        ...state,
        selectedDishes,
        shoppingList: generateShoppingList(selectedDishes),
      };
    }

    case 'REMOVE_DISH': {
      const selectedDishes = state.selectedDishes.filter(
        dish => dish.id !== action.payload
      );
      return {
        ...state,
        selectedDishes,
        shoppingList: generateShoppingList(selectedDishes),
      };
    }

    case 'UPDATE_SHOPPING_LIST':
      return { ...state, shoppingList: action.payload };

    case 'TOGGLE_INGREDIENT_OWNED':
      return {
        ...state,
        shoppingList: state.shoppingList.map(ingredient =>
          ingredient.id === action.payload
            ? { ...ingredient, isOwned: !ingredient.isOwned }
            : ingredient
        ),
      };

    case 'UPDATE_OWNED_INGREDIENTS':
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, ownedIngredients: action.payload },
      };

    case 'CLEAR_SELECTED_DISHES':
      return { ...state, selectedDishes: [], shoppingList: [] };

    case 'ADD_MEAL_PLAN':
      return { ...state, mealPlan: [...state.mealPlan, action.payload] };

    case 'REMOVE_MEAL_PLAN':
      return {
        ...state,
        mealPlan: state.mealPlan.filter(m => m.id !== action.payload),
      };

    case 'UPDATE_MEAL_PLAN':
      return {
        ...state,
        mealPlan: state.mealPlan.map(m =>
          m.id === action.payload.id ? action.payload : m
        ),
      };

    case 'SET_MEAL_PLAN':
      return { ...state, mealPlan: action.payload };

    case 'TOGGLE_SELECTED_INGREDIENT': {
      const ingredient = { ...action.payload, id: String(action.payload.id) };
      const exists = state.selectedIngredients.some(i => i.id === ingredient.id);

      return {
        ...state,
        selectedIngredients: exists
          ? state.selectedIngredients.filter(i => i.id !== ingredient.id)
          : [...state.selectedIngredients, ingredient],
      };
    }

    default:
      return state;
  }
}

/* =========================
   Helpers
========================= */

function generateShoppingList(dishes: Dish[]): Ingredient[] {
  if (!dishes.length) return [];

  const consolidated = new Map<string, Ingredient>();

  dishes.forEach(dish => {
    dish.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase();
      const existing = consolidated.get(key);

      if (existing) {
        const sum =
          (parseFloat(existing.amount) || 0) +
          (parseFloat(ingredient.amount) || 0);

        consolidated.set(key, {
          ...existing,
          amount: sum.toString(),
        });
      } else {
        consolidated.set(key, {
          ...ingredient,
          id:
            ingredient.id ||
            `${dish.id}-${ingredient.name
              .toLowerCase()
              .replace(/\s+/g, '-')}`,
          isOwned: false,
          dishId: dish.id,
          dishTitle: dish.title,
        });
      }
    });
  });

  return Array.from(consolidated.values());
}

/* =========================
   Provider
========================= */

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user: supabaseUser, loading: authLoading } = useSupabaseAuth();

  // 🔐 Supabase → App state
  useEffect(() => {
    if (supabaseUser) {
      dispatch({
        type: 'SET_USER',
        payload: {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || 'User',
          preferences: [],
          dislikedIngredients: [],
          ownedIngredients: [],
        },
      });
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }

    // ✅ AUTH RÉSOLUE ICI, UNE SEULE FOIS
    dispatch({ type: 'SET_LOADING', payload: false });
  }, [supabaseUser]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

/* =========================
   Hook
========================= */

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
