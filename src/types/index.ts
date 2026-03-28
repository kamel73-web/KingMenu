export interface User {
  id: string;
  email: string;
  name: string;
  preferences: string[];
  dislikedIngredients: string[];
  ownedIngredients: OwnedIngredient[];
  avatar?: string;
}

export interface Dish {
  id: string;
  title: string;
  image: string;
  cuisine: string;               // nom traduit / affichage
  cuisineId?: string | null;     // <-- ajouté : identifiant stable (pour logique / filtres)
  cookingTime: number;
  rating: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: string[];
  servings: number;
  calories: number;
  tags: string[];
  compatibilityScore?: number;
  missingIngredients?: Ingredient[];
  availableIngredients?: Ingredient[];
  translations?: {
    title?: Record<string, string>;
    description?: Record<string, string>;
    cuisine?: Record<string, string>;
  };
  instructionTranslations?: Record<string, string[]>;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: string;
  isOwned?: boolean;
  isOptional?: boolean;
  translations?: {
    name?: Record<string, string>;
    unit?: Record<string, string>;
  };
}

export interface OwnedIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  items: Ingredient[];
  createdAt: string;
  name: string;
}

export interface CuisineType {
  id: string;
  name: string;
  icon: string;
  color: string;
  translations?: Record<string, string>;
}

export interface IngredientCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  ingredients: string[];
  translations?: {
    name?: Record<string, string>;
  };
  ingredientTranslations?: Record<string, Record<string, string>>;
}

export interface DishMatch {
  dish: Dish;
  compatibilityScore: number;
  matchType: 'perfect' | 'near' | 'creative';
  availableIngredients: Ingredient[];
  missingIngredients: Ingredient[];
  substitutions?: { original: string; substitute: string }[];
}

export interface MealPlan {
  id: string;
  userId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dish: Dish;
  servings: number;
  notes?: string;
  createdAt: string;
}

export interface CalendarDay {
  date: string;
  meals: MealPlan[];
  isToday: boolean;
  isCurrentMonth: boolean;
}
