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
  const [mealType, setMealType] = useState<'breakfast'|'lunch'|'dinner'|'snack'>('dinner');
  const [servings, setServings] = useState(dish.servings);

  if (!isOpen) return null;

  const handleSchedule = () => {
    if (!state.user) { toast.error(t('common.error')); return; }
    const meal: MealPlan = {
      id: crypto.randomUUID(),
      userId: state.user.id,
      date: selectedDate,
      mealType,
      dish,
      servings,
      notes: undefined,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MEAL_PLAN', payload: meal });
    saveMealPlan(meal);
    toast.success(t('mealPlan.dishScheduled', { title: dish.title, date: selectedDate }));
    onClose();
  };

  const meals = [
    { value: 'breakfast', label: t('mealPlan.breakfast'), icon: '🌅' },
    { value: 'lunch',     label: t('mealPlan.lunch'),     icon: '☀️' },
    { value: 'dinner',    label: t('mealPlan.dinner'),    icon: '🌙' },
    { value: 'snack',     label: t('mealPlan.snack'),     icon: '🍎' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:w-96 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">

        {/* Poignée mobile */}
        <div className="sm:hidden flex justify-center pt-2">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header orange */}
        <div className="bg-orange-500 px-4 py-3 flex items-center gap-3">
          <img
            src={dish.image}
            alt={dish.title}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/30 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{dish.title}</p>
            <p className="text-orange-100 text-xs">{dish.cookingTime} min · {dish.difficulty}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Corps */}
        <div className="px-4 py-4 space-y-4">

          {/* Date */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <Calendar className="h-3.5 w-3.5 text-orange-500" />
              {t('mealPlan.selectDate')}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
            />
          </div>

          {/* Type de repas */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              {t('mealPlan.mealType')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {meals.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMealType(m.value as any)}
                  className={`py-2.5 px-1 rounded-xl border-2 text-center transition-all ${
                    mealType === m.value
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-gray-200 bg-gray-50 hover:border-orange-300'
                  }`}
                >
                  <div className="text-xl leading-none mb-1">{m.icon}</div>
                  <div className="text-xs font-medium leading-tight">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Portions */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <Users className="h-3.5 w-3.5 text-orange-500" />
              {t('mealPlan.servings')}
            </label>
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2 border-2 border-gray-200">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                disabled={servings <= 1}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center disabled:opacity-40"
              >
                −
              </button>
              <span className="text-2xl font-bold text-gray-800">{servings}</span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Boutons action */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSchedule}
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600"
            >
              {t('mealPlan.schedule')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
