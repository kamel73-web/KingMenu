import React, { useState } from 'react';
import { Clock, Star, Plus, Check, Eye, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dish } from '../../types';
import { useApp } from '../../context/AppContext';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import RecipeModal from '../Recipe/RecipeModal';
import CookModeModal from '../Recipe/CookModeModal';
import ScheduleDishModal from '../MealPlanning/ScheduleDishModal';
import toast from 'react-hot-toast';

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const { translateDish, translateDifficulty, translateTag } = useTranslatedContent();
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showCookMode, setShowCookMode] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const isSelected = state.selectedDishes.some(d => d.id === dish.id);

  const translatedDish = translateDish(dish);
  const translatedDifficulty = translateDifficulty(dish.difficulty);

  const handleAddDish = () => {
    if (isSelected) {
      dispatch({ type: 'REMOVE_DISH', payload: dish.id });
      toast.success(`${translatedDish.title} ${t('common.removed')}`);
    } else {
      dispatch({ type: 'ADD_DISH', payload: translatedDish });
      toast.success(`${translatedDish.title} ${t('common.added')}`);
    }
  };

  const handleScheduleDish = () => {
    setShowScheduleModal(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col w-full font-sans">
        {/* Image principale */}
        <div className="relative">
          <img
            src={translatedDish.image}
            alt={translatedDish.title}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-3xl"
            loading="lazy"
          />
          {/* Overlay violet doux */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl" />

          {/* Badge difficulté */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm bg-white/90 shadow ${getDifficultyColor(
                dish.difficulty?.en
              )}`}
            >
              {translatedDifficulty}
            </span>
          </div>

          {/* Badge cuisine */}
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow">
              {translatedDish.cuisine}
            </span>
          </div>

          {/* Bouton aperçu */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
            <button
              onClick={() => setShowRecipeModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-[#5E2EED] text-white rounded-full hover:bg-[#4d24d0] transition-all transform scale-95 hover:scale-100 shadow-lg font-semibold"
            >
              <Eye className="h-5 w-5" />
              <span>{t('dish.previewRecipe')}</span>
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-bold text-2xl text-gray-900 mb-3 leading-snug">
              {translatedDish.title}
            </h3>

            <div className="flex items-center space-x-5 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1.5">
                <Clock className="h-5 w-5 text-[#5E2EED]" />
                <span className="font-semibold">
                  {dish.cookingTime}
                  {t('dish.minutes')}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{dish.rating}</span>
              </div>
              <div className="font-semibold">
                {dish.calories} {t('dish.calories')}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {dish.tags?.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                >
                  {translateTag(tag)}
                </span>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="mt-5">
            {/* Version Mobile */}
            <div className="flex sm:hidden justify-between items-center w-full gap-2">
              <button
                onClick={() => setShowRecipeModal(true)}
                className="w-12 h-12 border-2 border-primary-200 text-primary-500 rounded-full hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 flex items-center justify-center shadow-soft"
                title={t('dish.recipe')}
              >
                <Eye className="h-4 w-4" />
              </button>

              <button
                onClick={handleScheduleDish}
                className="w-12 h-12 bg-secondary-500 text-white rounded-full hover:bg-secondary-600 transition-all duration-200 flex items-center justify-center shadow-medium transform hover:scale-105"
                title={t('mealPlan.scheduleDish')}
              >
                <Calendar className="h-4 w-4" />
              </button>

              <button
                onClick={handleAddDish}
                className={`w-12 h-12 rounded-full font-bold transition-all duration-200 flex items-center justify-center shadow-medium transform hover:scale-105 ${
                  isSelected
                    ? 'bg-accent-500 text-white hover:bg-accent-600'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
                title={isSelected ? t('dish.added') : t('dish.add')}
              >
                {isSelected ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
            </div>

            {/* Version Desktop */}
            <div className="hidden sm:flex w-full gap-3">
              <button
                onClick={() => setShowRecipeModal(true)}
                className="flex-1 flex items-center justify-center py-3 px-4 border-2 border-primary-500 text-primary-500 rounded-full hover:bg-primary-50 transition-all duration-200 text-sm font-semibold shadow-soft"
                title={t('dish.recipe')}
              >
                <Eye className="h-4 w-4" />
              </button>

              <button
                onClick={handleScheduleDish}
                className="flex-1 flex items-center justify-center py-3 px-4 border-2 border-secondary-500 text-secondary-500 rounded-full hover:bg-secondary-50 transition-all duration-200 text-sm font-semibold shadow-soft"
                title={t('mealPlan.schedule')}
              >
                <Calendar className="h-4 w-4" />
              </button>

              <button
                onClick={handleAddDish}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-full transition-all duration-200 text-sm font-semibold shadow-medium transform hover:scale-105 ${
                  isSelected
                    ? 'bg-accent-500 text-white hover:bg-accent-600'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
                title={isSelected ? t('dish.added') : t('dish.add')}
              >
                {isSelected ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RecipeModal
        dish={translatedDish}
        isOpen={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        onEnterCookMode={() => {
          setShowRecipeModal(false);
          setShowCookMode(true);
        }}
      />
      <CookModeModal
        dish={translatedDish}
        isOpen={showCookMode}
        onClose={() => setShowCookMode(false)}
      />
      <ScheduleDishModal
        dish={translatedDish}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </>
  );
}
