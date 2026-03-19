import { useState } from 'react';
import { X, Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dish, MealPlan } from '../../types';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useMealPlan } from '../../hooks/useMealPlan';

interface ScheduleDishModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleDishModal({ dish, isOpen, onClose }: ScheduleDishModalProps) {
  const { state, dispatch } = useApp();
  const { saveMealPlan } = useMealPlan();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');
  const [servings, setServings] = useState(dish.servings);

  if (!isOpen) return null;

  const handleSchedule = () => {
    if (!state.user) { toast.error(t('common.error')); return; }
    const newMealPlan: MealPlan = {
      id: crypto.randomUUID(),
      userId: state.user.id,
      date: selectedDate,
      mealType,
      dish,
      servings,
      notes: undefined,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MEAL_PLAN', payload: newMealPlan });
    saveMealPlan(newMealPlan);
    toast.success(t('mealPlan.dishScheduled', { title: dish.title, date: selectedDate }));
    onClose();
  };

  const mealTypeOptions = [
    { value: 'breakfast', label: t('mealPlan.breakfast'), icon: '🌅' },
    { value: 'lunch',     label: t('mealPlan.lunch'),      icon: '☀️' },
    { value: 'dinner',    label: t('mealPlan.dinner'),     icon: '🌙' },
    { value: 'snack',     label: t('mealPlan.snack'),      icon: '🍎' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl">

        {/* Header compact */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={dish.image} alt={dish.title}
              className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">{dish.title}</p>
              <p className="text-xs text-gray-500">{dish.cookingTime} min · {dish.difficulty}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-3 space-y-4">

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              {t('mealPlan.selectDate')}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="date" value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none" />
            </div>
          </div>

          {/* Type de repas */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              {t('mealPlan.mealType')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {mealTypeOptions.map((option) => (
                <button key={option.value} onClick={() => setMealType(option.value as any)}
                  className={`py-2 px-1 rounded-xl border-2 text-center transition-all ${
                    mealType === option.value
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}>
                  <div className="text-lg leading-none mb-1">{option.icon}</div>
                  <div className="text-xs font-medium leading-tight">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Portions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t('mealPlan.servings')}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300 font-bold">
                −
              </button>
              <span className="font-bold text-lg w-6 text-center">{servings}</span>
              <button onClick={() => setServings(servings + 1)}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300 font-bold">
                +
              </button>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-1 pb-1">
            <button onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
              {t('common.cancel')}
            </button>
            <button onClick={handleSchedule}
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600">
              {t('mealPlan.schedule')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
