import React, { useState } from 'react';
import { X, Calendar, Clock, Users, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dish, MealPlan } from '../../types';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

interface ScheduleDishModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleDishModal({ dish, isOpen, onClose }: ScheduleDishModalProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');
  const [servings, setServings] = useState(dish.servings);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSchedule = () => {
    if (!state.user) {
      toast.error(t('common.error'));
      return;
    }

    const newMealPlan: MealPlan = {
      id: `meal-${Date.now()}-${Math.random()}`,
      userId: state.user.id,
      date: selectedDate,
      mealType,
      dish,
      servings,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_MEAL_PLAN', payload: newMealPlan });
    toast.success(t('mealPlan.dishScheduled', { title: dish.title, date: selectedDate }));
    onClose();
  };

  const mealTypeOptions = [
    { value: 'breakfast', label: t('mealPlan.breakfast'), icon: '🌅' },
    { value: 'lunch', label: t('mealPlan.lunch'), icon: '☀️' },
    { value: 'dinner', label: t('mealPlan.dinner'), icon: '🌙' },
    { value: 'snack', label: t('mealPlan.snack'), icon: '🍎' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-heading font-bold text-gray-900">
            {t('mealPlan.scheduleDish')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dish Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={dish.image}
              alt={dish.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-gray-900">{dish.title}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{dish.cookingTime}m</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ChefHat className="h-4 w-4" />
                  <span>{dish.difficulty}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              {t('mealPlan.selectDate')}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Meal Type Selection */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-3">
              {t('mealPlan.mealType')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {mealTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMealType(option.value as any)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    mealType === option.value
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-body font-medium text-sm">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Servings */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              {t('mealPlan.servings')}
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
              >
                -
              </button>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="font-heading font-bold text-lg w-8 text-center">{servings}</span>
              </div>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              {t('mealPlan.notes')} ({t('common.optional')})
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('mealPlan.notesPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-body font-medium hover:bg-gray-50 transition-all"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSchedule}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-body font-medium hover:bg-primary-dark transition-all"
            >
              {t('mealPlan.schedule')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}