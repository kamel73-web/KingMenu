import { useState } from 'react';
import { X, Calendar, Clock, Users } from 'lucide-react';
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

export default function ScheduleDishModal({
  dish,
  isOpen,
  onClose,
}: ScheduleDishModalProps) {
  const { t } = useTranslation();
  const { state, dispatch } = useApp();
  const { saveMealPlan } = useMealPlan();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');
  const [servings, setServings] = useState(dish.servings ?? 2);

  if (!isOpen) return null;

  const handleSchedule = async () => {
    try {
      const newEntry: MealPlan = {
        id: crypto.randomUUID(),
        userId: state.user?.id ?? '',
        date: selectedDate,
        mealType,
        servings,
        createdAt: new Date().toISOString(),
        dish: dish,  // objet Dish complet — requis par saveMealPlan
      };

      dispatch({ type: 'ADD_MEAL_PLAN', payload: newEntry });
      await saveMealPlan(newEntry);

      toast.success(t('mealPlan.dishScheduled', { title: dish.title }));
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(t('common.errorOccurred'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-white/20 transition"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-semibold">{t('mealPlan.scheduleDish')}</h2>
          <p className="mt-1 text-sm opacity-90">{dish.title}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar size={18} />
              {t('common.date')}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none"
            />
          </div>

          {/* Meal type */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Clock size={18} />
              {t('mealPlan.mealType')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${
                    mealType === type
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {t(`mealTypes.${type}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Servings */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Users size={18} />
              {t('common.servings')}
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={servings}
              onChange={(e) => setServings(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSchedule}
            className="flex-1 rounded-lg bg-amber-600 px-4 py-2.5 font-medium text-white hover:bg-amber-700 transition shadow-sm"
          >
            {t('mealPlan.addToPlan')}
          </button>
        </div>
      </div>
    </div>
  );
}
