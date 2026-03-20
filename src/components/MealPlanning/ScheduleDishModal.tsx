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
    { value: 'lunch',     label: t('mealPlan.lunch'),     icon: '☀️' },
    { value: 'dinner',    label: t('mealPlan.dinner'),    icon: '🌙' },
    { value: 'snack',     label: t('mealPlan.snack'),     icon: '🍎' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full rounded-t-2xl shadow-2xl"
        style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={dish.image}
              alt={dish.title}
              style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
            />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{dish.title}</p>
              <p className="text-xs text-gray-500">{dish.cookingTime} min · {dish.difficulty}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: 6, borderRadius: 8, flexShrink: 0 }}
            className="hover:bg-gray-100"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600" style={{ marginBottom: 6 }}>
              {t('mealPlan.selectDate')}
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%', paddingLeft: 32, paddingRight: 12,
                  paddingTop: 10, paddingBottom: 10,
                  fontSize: 14, border: '1px solid #d1d5db',
                  borderRadius: 10, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Type de repas */}
          <div>
            <label className="block text-xs font-medium text-gray-600" style={{ marginBottom: 6 }}>
              {t('mealPlan.mealType')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {mealTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMealType(option.value as any)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 12,
                    border: `2px solid ${mealType === option.value ? '#f97316' : '#e5e7eb'}`,
                    background: mealType === option.value ? '#f97316' : '#fff',
                    color: mealType === option.value ? '#fff' : '#374151',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all .15s',
                  }}
                >
                  <div style={{ fontSize: 20, lineHeight: 1, marginBottom: 4 }}>{option.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 500, lineHeight: 1.2 }}>{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Portions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} className="text-gray-500" />
              <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{t('mealPlan.servings')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb', border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >−</button>
              <span style={{ fontSize: 18, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{servings}</span>
              <button
                onClick={() => setServings(servings + 1)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb', border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >+</button>
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: 10, paddingBottom: 8 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px 0', border: '1px solid #d1d5db',
                borderRadius: 12, fontSize: 14, fontWeight: 500,
                color: '#374151', background: '#fff', cursor: 'pointer'
              }}
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSchedule}
              style={{
                flex: 1, padding: '12px 0', border: 'none',
                borderRadius: 12, fontSize: 14, fontWeight: 500,
                color: '#fff', background: '#f97316', cursor: 'pointer'
              }}
            >
              {t('mealPlan.schedule')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
