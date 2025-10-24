import React, { useState } from 'react';
import { X, Clock, Users, ChefHat, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import RecipeViewer from '../Recipe/RecipeViewer';
import CookModeModal from '../Recipe/CookModeModal';
import { Dish } from '../../types';
import toast from 'react-hot-toast';

export default function SelectedDishesPanel() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const [showRecipes, setShowRecipes] = useState(false);
  const [cookModeDish, setCookModeDish] = useState<Dish | null>(null);

  const handleRemoveDish = (dishId: string) => {
    dispatch({ type: 'REMOVE_DISH', payload: dishId });
    toast.success(t('common.removed'));
  };

  const totalCookingTime = state.selectedDishes.reduce((total, dish) => total + dish.cookingTime, 0);
  const totalServings = state.selectedDishes.reduce((total, dish) => total + dish.servings, 0);

  if (state.selectedDishes.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-soft p-10 text-center">
        <div className="relative mb-8">
          {/* Decorative circles */}
          <div className="absolute -top-3 -left-3 w-5 h-5 bg-primary-200 rounded-full animate-float"></div>
          <div className="absolute -top-2 -right-4 w-4 h-4 bg-secondary-200 rounded-full animate-float delay-300"></div>
          <div className="absolute -bottom-3 -right-2 w-6 h-6 bg-warm-gray-200 rounded-full animate-float delay-700"></div>
          <div className="absolute -bottom-2 -left-4 w-3 h-3 bg-primary-300 rounded-full animate-float delay-500"></div>

          {/* Main icon container with gradient */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200/30 via-secondary-200/30 to-warm-gray-200/30 rounded-full blur-md"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-white to-warm-gray-50 rounded-full flex items-center justify-center shadow-strong border border-warm-gray-100">
              <div className="relative">
                {/* Menu text curved around icon */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs font-heading font-bold text-primary-500 tracking-widest">MENU</span>
                </div>

                {/* Main utensils icon */}
                <div className="text-4xl">🍽️</div>

                {/* Decorative dots around */}
                <div className="absolute -top-1.5 -left-1.5 w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                <div className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 bg-secondary-400 rounded-full"></div>
                <div className="absolute -bottom-1.5 -left-1.5 w-1.5 h-1.5 bg-secondary-400 rounded-full"></div>
                <div className="absolute -bottom-1.5 -right-1.5 w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-heading font-bold text-warm-gray-900 mb-3">
          {t('selectedDishes.noDishesSelected')}
        </h3>
        <p className="text-warm-gray-600 font-body leading-relaxed text-base">
          {t('selectedDishes.startAdding')}
        </p>

        {/* Decorative bottom accent */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-secondary-300 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-soft p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-heading font-bold text-warm-gray-900">
            {t('selectedDishes.title')} ({state.selectedDishes.length})
          </h3>
          <div className="flex items-center space-x-4 text-sm text-warm-gray-600">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-5 w-5 text-primary-500" />
              <span className="font-semibold">{totalCookingTime}m {t('selectedDishes.totalTime')}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="h-5 w-5 text-secondary-500" />
              <span className="font-semibold">{totalServings} {t('dish.servings')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {state.selectedDishes.map(dish => (
            <div key={dish.id} className="flex items-center space-x-4 p-4 bg-warm-gray-50 rounded-2xl hover:bg-warm-gray-100 transition-colors">
              <img
                src={dish.image}
                alt={dish.title}
                className="w-16 h-16 object-cover rounded-2xl shadow-soft"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-bold text-warm-gray-900 truncate">
                  {dish.title}
                </h4>
                <p className="text-sm text-warm-gray-600 font-semibold">
                  {dish.cuisine} • {dish.cookingTime}m • {dish.servings} {t('dish.servings')}
                </p>
              </div>
              <button
                onClick={() => setCookModeDish(dish)}
                className="p-3 text-primary-500 hover:bg-primary-50 rounded-full transition-all"
                title={t('dish.cookMode')}
              >
                <ChefHat className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleRemoveDish(dish.id)}
                className="p-3 text-warm-gray-400 hover:text-error hover:bg-red-50 rounded-full transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-warm-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-warm-gray-600 font-semibold">
              {t('selectedDishes.totalIngredients')}: {state.shoppingList.length}
            </p>
            <button
              onClick={() => setShowRecipes(!showRecipes)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all shadow-medium font-semibold transform hover:scale-105"
            >
              <Eye className="h-5 w-5" />
              <span className="font-body font-semibold">
                {showRecipes ? t('common.hideRecipes') : t('common.viewRecipes')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Viewer */}
      {showRecipes && (
        <RecipeViewer
          dishes={state.selectedDishes}
          onEnterCookMode={(dish) => setCookModeDish(dish)}
        />
      )}

      {/* Cook Mode Modal */}
      {cookModeDish && (
        <CookModeModal
          dish={cookModeDish}
          isOpen={!!cookModeDish}
          onClose={() => setCookModeDish(null)}
        />
      )}
    </div>
  );
}