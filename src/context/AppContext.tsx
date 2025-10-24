import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseData';
import { User, Dish, Ingredient, OwnedIngredient, MealPlan } from '../types';

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
  | { type: 'ADD_DISH'; payload: Dish }
  | { type: 'REMOVE_DISH'; payload: string }
  | { type: 'UPDATE_SHOPPING_LIST'; payload: Ingredient[] }
  | { type: 'TOGGLE_INGREDIENT_OWNED'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_OWNED_INGREDIENTS'; payload: OwnedIngredient[] }
  | { type: 'CLEAR_SELECTED_DISHES' }
  | { type: 'ADD_MEAL_PLAN'; payload: MealPlan }
  | { type: 'REMOVE_MEAL_PLAN'; payload: string }
  | { type: 'UPDATE_MEAL_PLAN'; payload: MealPlan }
  | { type: 'SET_MEAL_PLAN'; payload: MealPlan[] }
  | { type: 'TOGGLE_SELECTED_INGREDIENT'; payload: Ingredient };

const initialState: AppState = {
  user: null,
  selectedDishes: [],
  shoppingList: [],
  mealPlan: [],
  isLoading: false,
  selectedIngredients: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_DISH':
      const dishToAdd = {
        ...action.payload,
        ingredients: action.payload.ingredients.map(ingredient => ({
          ...ingredient,
          id: ingredient.id || `${action.payload.id}-${ingredient.name.toLowerCase().replace(/\s+/g, '-')}`,
          isOwned: false
        }))
      };
      const newSelectedDishes = [...state.selectedDishes, dishToAdd];
      const newShoppingList = generateShoppingList(newSelectedDishes);
      return {
        ...state,
        selectedDishes: newSelectedDishes,
        shoppingList: newShoppingList,
      };
    case 'REMOVE_DISH':
      const filteredDishes = state.selectedDishes.filter(dish => dish.id !== action.payload);
      const updatedShoppingList = generateShoppingList(filteredDishes);
      return {
        ...state,
        selectedDishes: filteredDishes,
        shoppingList: updatedShoppingList,
      };
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
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_OWNED_INGREDIENTS':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          ownedIngredients: action.payload,
        },
      };
    case 'CLEAR_SELECTED_DISHES':
      return { ...state, selectedDishes: [], shoppingList: [] };
    case 'ADD_MEAL_PLAN':
      return {
        ...state,
        mealPlan: [...state.mealPlan, action.payload],
      };
    case 'REMOVE_MEAL_PLAN':
      return {
        ...state,
        mealPlan: state.mealPlan.filter(meal => meal.id !== action.payload),
      };
    case 'UPDATE_MEAL_PLAN':
      return {
        ...state,
        mealPlan: state.mealPlan.map(meal =>
          meal.id === action.payload.id ? action.payload : meal
        ),
      };
    case 'SET_MEAL_PLAN':
      return { ...state, mealPlan: action.payload };
    case 'TOGGLE_SELECTED_INGREDIENT':
      const normalizedIngredient = {
        ...action.payload,
        id: action.payload.id.toString(),
      };
      const exists = state.selectedIngredients.some(i => i.id === normalizedIngredient.id);
      const updatedIngredients = exists
        ? state.selectedIngredients.filter(i => i.id !== normalizedIngredient.id)
        : [...state.selectedIngredients, normalizedIngredient];
      console.log('Ingrédients sélectionnés mis à jour:', updatedIngredients);
      return {
        ...state,
        selectedIngredients: updatedIngredients,
      };
    default:
      return state;
  }
}

function generateShoppingList(dishes: Dish[]): Ingredient[] {
  console.log('Generating shopping list for dishes:', dishes.length);
  
  if (dishes.length === 0) {
    return [];
  }

  const allIngredients = dishes.flatMap(dish => {
    console.log(`Processing dish: ${dish.title} with ${dish.ingredients.length} ingredients`);
    return dish.ingredients.map(ingredient => ({
      ...ingredient,
      id: ingredient.id || `${dish.id}-${ingredient.name.toLowerCase().replace(/\s+/g, '-')}`,
      isOwned: false,
      dishId: dish.id,
      dishTitle: dish.title
    }));
  });

  console.log('All ingredients extracted:', allIngredients.length);

  const consolidated = new Map<string, Ingredient>();
  
  allIngredients.forEach(ingredient => {
    const key = ingredient.name.toLowerCase();
    if (consolidated.has(key)) {
      const existing = consolidated.get(key)!;
      const existingNum = parseFloat(existing.amount) || 0;
      const newNum = parseFloat(ingredient.amount) || 0;
      const summedAmount = (existingNum + newNum).toString();
      consolidated.set(key, {
        ...existing,
        amount: summedAmount,
      });
    } else {
      consolidated.set(key, { ...ingredient });
    }
  });
  
  const result = Array.from(consolidated.values());
  console.log('Consolidated shopping list:', result.length, 'items');
  
  return result;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user: supabaseUser, loading: authLoading } = useSupabaseAuth();

  React.useEffect(() => {
    if (supabaseUser && !state.user) {
      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.full_name || 'User',
        preferences: [],
        dislikedIngredients: [],
        ownedIngredients: [],
      };
      dispatch({ type: 'SET_USER', payload: user });
    } else if (!supabaseUser && state.user) {
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [supabaseUser, state.user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
