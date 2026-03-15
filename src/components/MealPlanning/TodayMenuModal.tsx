import { useState } from 'react';
import { X, Clock, Users, ChefHat, UtensilsCrossed, Sun, Sunset, Coffee, Apple } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { MealPlan } from '../../types';
import RecipeModal from '../Recipe/RecipeModal';
import CookModeModal from '../Recipe/CookModeModal';

interface TodayMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEAL_CONFIG = {
  breakfast: { icon: Coffee,  labelKey: 'mealPlan.breakfast', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  lunch:     { icon: Sun,     labelKey: 'mealPlan.lunch',     color: 'bg-blue-50   border-blue-200   text-blue-700'   },
  dinner:    { icon: Sunset,  labelKey: 'mealPlan.dinner',    color: 'bg-purple-50 border-purple-200 text-purple-700' },
  snack:     { icon: Apple,   labelKey: 'mealPlan.snack',     color: 'bg-green-50  border-green-200  text-green-700'  },
};

const MEAL_ORDER = ['breakfast', 'lunch', 'snack', 'dinner'];

export default function TodayMenuModal({ isOpen, onClose }: TodayMenuModalProps) {
  const { state } = useApp();
  const { t } = useTranslation();
  const [recipeModal, setRecipeModal] = useState<MealPlan | null>(null);
  const [cookMode, setCookMode]       = useState<MealPlan | null>(null);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = state.mealPlan
    .filter(m => m.date === todayStr)
    .sort((a, b) => MEAL_ORDER.indexOf(a.mealType) - MEAL_ORDER.indexOf(b.mealType));

  const totalTime = todayMeals.reduce((s, m) => s + m.dish.cookingTime, 0);
  const totalCals = todayMeals.reduce((s, m) => s + (m.dish.calories || 0) * m.servings, 0);

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        {/* Panel */}
        <div
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-white" />
                <span className="text-white font-bold text-lg">Menu du jour</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-orange-100 text-sm capitalize">{dateLabel}</p>

            {/* Stats bar */}
            {todayMeals.length > 0 && (
              <div className="flex gap-4 mt-3">
                <div className="bg-white/20 rounded-xl px-3 py-1.5 text-center">
                  <p className="text-white font-bold text-sm">{todayMeals.length}</p>
                  <p className="text-orange-100 text-xs">repas</p>
                </div>
                <div className="bg-white/20 rounded-xl px-3 py-1.5 text-center">
                  <p className="text-white font-bold text-sm">{totalTime} min</p>
                  <p className="text-orange-100 text-xs">en cuisine</p>
                </div>
                <div className="bg-white/20 rounded-xl px-3 py-1.5 text-center">
                  <p className="text-white font-bold text-sm">{totalCals} kcal</p>
                  <p className="text-orange-100 text-xs">total</p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3">
            {todayMeals.length === 0 ? (
              <div className="text-center py-12">
                <UtensilsCrossed className="h-14 w-14 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Aucun repas planifié aujourd'hui</p>
                <p className="text-gray-400 text-sm mt-1">
                  Ajoutez des plats depuis la page Accueil
                </p>
              </div>
            ) : (
              todayMeals.map(meal => {
                const cfg = MEAL_CONFIG[meal.mealType as keyof typeof MEAL_CONFIG] || MEAL_CONFIG.dinner;
                const Icon = cfg.icon;
                return (
                  <div
                    key={meal.id}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Meal type badge */}
                    <div className={`flex items-center gap-2 px-4 py-2 border-b ${cfg.color}`}>
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {t(cfg.labelKey)}
                      </span>
                    </div>

                    {/* Dish info */}
                    <div className="flex items-center gap-3 p-3">
                      <img
                        src={meal.dish.image}
                        alt={meal.dish.title}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{meal.dish.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meal.dish.cookingTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {meal.servings} pers.
                          </span>
                          <span>{meal.dish.calories} kcal</span>
                        </div>
                        {meal.notes && (
                          <p className="text-xs text-gray-400 mt-1 italic truncate">
                            💬 {meal.notes}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => setRecipeModal(meal)}
                          className="p-2 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-100 transition-all"
                          title="Voir la recette"
                        >
                          <ChefHat className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {recipeModal && (
        <RecipeModal
          dish={recipeModal.dish}
          isOpen={!!recipeModal}
          onClose={() => setRecipeModal(null)}
          onEnterCookMode={() => {
            setCookMode(recipeModal);
            setRecipeModal(null);
          }}
        />
      )}
      {cookMode && (
        <CookModeModal
          dish={cookMode.dish}
          isOpen={!!cookMode}
          onClose={() => setCookMode(null)}
        />
      )}
    </>
  );
}
