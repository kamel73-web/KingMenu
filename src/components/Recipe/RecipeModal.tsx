import React, { useState, useEffect } from 'react';
import { X, Clock, Users, ChefHat, Maximize2, Heart } from 'lucide-react';
import { Dish } from '../../types';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface RecipeModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
  onEnterCookMode: () => void;
}

export default function RecipeModal({ dish, isOpen, onClose, onEnterCookMode }: RecipeModalProps) {
  const [servings, setServings] = useState(dish.servings);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [highlightedIngredients, setHighlightedIngredients] = useState<Set<string>>(new Set());
  const [isFavorite, setIsFavorite] = useState(false);

  const { dispatch } = useApp();
  const { t } = useTranslation();
  const { translateDifficulty, translateUnit } = useTranslatedContent();

  if (!isOpen) return null;

  const servingMultiplier = servings / dish.servings;

  // --------------------------
  // FAVORITES : Load on open
  // --------------------------
  useEffect(() => {
    if (!isOpen) return;

    const loadFavoriteStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('saved_dishes')
        .select('dish_id')
        .eq('user_id', user.id)
        .eq('dish_id', dish.id)
        .maybeSingle();

      setIsFavorite(!!data);
    };

    loadFavoriteStatus();
  }, [isOpen, dish.id]);

  // --------------------------
  // FAVORITES : Toggle
  // --------------------------
  const toggleFavorite = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error(t('errors.mustBeLoggedIn'));
      return;
    }

    if (isFavorite) {
      // Remove from saved_dishes
      const { error } = await supabase
        .from('saved_dishes')
        .delete()
        .eq('user_id', user.id)
        .eq('dish_id', dish.id);

      if (!error) {
        setIsFavorite(false);
        toast.success(t('favorites.removed'));
      }
    } else {
      // Add to saved_dishes
      const { error } = await supabase.from('saved_dishes').insert({
        user_id: user.id,
        dish_id: dish.id,
      });

      if (!error) {
        setIsFavorite(true);
        toast.success(t('favorites.added'));
      }
    }
  };

  // --------------------------
  // STEPS & INGREDIENTS
  // --------------------------
  const handleStepToggle = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) newCompleted.delete(stepIndex);
    else newCompleted.add(stepIndex);
    setCompletedSteps(newCompleted);
  };

  const handleIngredientHover = (ingredientName: string) => {
    setHighlightedIngredients(new Set([ingredientName.toLowerCase()]));
  };

  const handleIngredientLeave = () => {
    setHighlightedIngredients(new Set());
  };

  const handleAddToMenu = () => {
    dispatch({ type: 'ADD_DISH', payload: dish });
    toast.success(t('recipe.addedToMenu', { title: dish.title }));
    onClose();
  };

  const adjustQuantity = (amount: string) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return amount;
    return (numericAmount * servingMultiplier).toFixed(1).replace(/\.0$/, '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="relative">
          <img
            src={dish.image}
            alt={dish.title}
            className="w-full h-48 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* ❤️ FAVORITE BUTTON */}
          <button
            onClick={toggleFavorite}
            className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
            title={isFavorite ? t('favorites.remove') : t('favorites.add')}
          >
            <Heart
              className={`h-6 w-6 transition-all ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>

          {/* Existing buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={onEnterCookMode}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-all"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Title info */}
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-2xl font-heading font-bold mb-2">{dish.title}</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{dish.cookingTime} {t('dish.minutes')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ChefHat className="h-4 w-4" />
                <span>{translateDifficulty(dish.difficulty)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{dish.servings} {t('dish.servings')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT BELOW — unchanged */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-body font-medium text-gray-700">{t('recipeDetails.adjustServings')}</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-all"
                >
                  -
                </button>
                <span className="font-heading font-bold text-lg w-8 text-center">{servings}</span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* INGREDIENTS */}
            <div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                {t('recipeDetails.ingredients')}
              </h3>
              <div className="space-y-3">
                {dish.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      highlightedIngredients.has(ingredient.name.toLowerCase())
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onMouseEnter={() => handleIngredientHover(ingredient.name)}
                    onMouseLeave={handleIngredientLeave}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-body font-medium text-gray-900">
                        {ingredient.name}
                      </span>
                      <span className="text-primary font-body font-semibold">
                        {adjustQuantity(ingredient.amount)} {translateUnit(ingredient.unit)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">
                      {ingredient.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* INSTRUCTIONS */}
            <div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                {t('recipeDetails.instructions')}
              </h3>
              <div className="space-y-4">
                {dish.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all ${
                      completedSteps.has(index)
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => handleStepToggle(index)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          completedSteps.has(index)
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {completedSteps.has(index) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-body font-semibold text-primary">
                            {t('recipe.step')} {index + 1}
                          </span>
                        </div>
                        <p className={`font-body text-gray-700 ${
                          completedSteps.has(index) ? 'line-through opacity-60' : ''
                        }`}>
                          {String(instruction)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToMenu}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-body font-medium hover:bg-primary-dark transition-all"
            >
              {t('recipe.addToMenu')}
            </button>
            <button
              onClick={onEnterCookMode}
              className="flex-1 bg-accent text-white py-3 px-6 rounded-lg font-body font-medium hover:bg-accent/90 transition-all flex items-center justify-center space-x-2"
            >
              <ChefHat className="h-5 w-5" />
              <span>{t('dish.cookMode')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
