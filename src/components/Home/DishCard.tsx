// Integrated DishCard with favorites button placed among action buttons for both mobile and desktop
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Plus, Check, Eye, Calendar, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dish } from '../../types';
import { useApp } from '../../context/AppContext';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import RecipeModal from '../Recipe/RecipeModal';
import CookModeModal from '../Recipe/CookModeModal';
import ScheduleDishModal from '../MealPlanning/ScheduleDishModal';
import toast from 'react-hot-toast';
import AddToFavoritesButton from '../Favorites/AddToFavoritesButton';

interface DishCardProps {
  dish: Dish;
  favorites?: number[];
  toggleFavorite?: (id: number) => Promise<void>;
}

export default function DishCard({ dish, favorites = [], toggleFavorite }: DishCardProps) {
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

  const handleScheduleDish = () => setShowScheduleModal(true);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':   return 'bg-success-50 text-success-600';
      case 'medium': return 'bg-warning-50 text-warning-600';
      case 'hard':   return 'bg-error-50 text-error-600';
      default:       return 'bg-neutral-100 text-content-muted';
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-card border border-neutral-100 overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group flex flex-col w-full font-sans">
        <div className="relative">
          {/* ── MODIFICATION : lazy loading natif du navigateur ── */}
          <img
            src={translatedDish.image}
            alt={translatedDish.title}
            loading="lazy"
            decoding="async"
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-3xl"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = '1';
                target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';
              }
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl" />

          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm bg-white/90 shadow ${getDifficultyColor(dish.difficulty as string)}`}>
              {translatedDifficulty}
            </span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-semibold text-content-body shadow-soft">
              {translatedDish.cuisine}
            </span>
          </div>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
            <button
              onClick={() => setShowRecipeModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all transform scale-95 hover:scale-100 shadow-medium font-semibold"
            >
              <Eye className="h-5 w-5" />
              <span>{t('dish.previewRecipe')}</span>
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-bold text-2xl text-content-title leading-snug">{translatedDish.title}</h3>
              <Link
                to={`/dish/${dish.id}`}
                className="flex-shrink-0 p-1.5 text-content-hint hover:text-primary-500 transition-colors"
                title={t('dish.viewDetails', 'Voir le détail')}
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex items-center space-x-5 text-sm text-content-muted mb-4">
              <div className="flex items-center space-x-1.5">
                <Clock className="h-5 w-5 text-primary-500" />
                <span className="font-semibold">{dish.cookingTime}{t('dish.minutes')}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{dish.rating}</span>
              </div>

              <div className="font-semibold">{dish.calories} {t('dish.calories')}</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {dish.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                  {translateTag(tag)}
                </span>
              ))}
            </div>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="mt-5">

            {/* MOBILE */}
            <div className="flex sm:hidden justify-between items-center w-full gap-2">

              <button
                onClick={() => setShowRecipeModal(true)}
                className="w-12 h-12 border border-primary-200 text-primary-500 rounded-full hover:bg-primary-50 hover:border-primary-500 transition-all flex items-center justify-center"
                title={t('dish.recipe')}
              >
                <Eye className="h-4 w-4" />
              </button>

              <button
                onClick={handleScheduleDish}
                className="w-12 h-12 bg-secondary-500 text-white rounded-full hover:bg-secondary-600 transition-all flex items-center justify-center"
                title={t('mealPlan.scheduleDish')}
              >
                <Calendar className="h-4 w-4" />
              </button>

              <button
                onClick={handleAddDish}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? 'bg-accent-400 text-white hover:bg-accent-500' : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
                title={isSelected ? t('dish.added') : t('dish.add')}
              >
                {isSelected ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>

              <div className="w-12 h-12 flex items-center justify-center">
                <AddToFavoritesButton dishId={dish.id} favorites={favorites} toggleFavorite={toggleFavorite} />
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden sm:grid sm:grid-cols-4 w-full gap-2">
              <button
                onClick={() => setShowRecipeModal(true)}
                className="flex items-center justify-center py-3 border border-primary-200 text-primary-500 rounded-full hover:bg-primary-50 hover:border-primary-500 transition-all"
                title={t('dish.recipe')}
              >
                <Eye className="h-4 w-4" />
              </button>

              <button
                onClick={handleScheduleDish}
                className="flex items-center justify-center py-3 border border-secondary-200 text-secondary-500 rounded-full hover:bg-secondary-50 hover:border-secondary-500 transition-all"
                title={t('mealPlan.scheduleDish')}
              >
                <Calendar className="h-4 w-4" />
              </button>

              <button
                onClick={handleAddDish}
                className={`flex items-center justify-center py-3 rounded-full transition-all ${
                  isSelected ? 'bg-accent-400 text-white hover:bg-accent-500' : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
                title={isSelected ? t('dish.added') : t('dish.add')}
              >
                {isSelected ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>

              <div className="flex items-center justify-center py-3 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-all">
                <AddToFavoritesButton dishId={dish.id} size={20} favorites={favorites} toggleFavorite={toggleFavorite} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecipeModal dish={translatedDish} isOpen={showRecipeModal} onClose={() => setShowRecipeModal(false)} onEnterCookMode={() => { setShowRecipeModal(false); setShowCookMode(true); }} />
      <CookModeModal dish={translatedDish} isOpen={showCookMode} onClose={() => setShowCookMode(false)} />
      <ScheduleDishModal dish={translatedDish} isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} />
    </>
  );
}
