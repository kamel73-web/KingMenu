import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, Users, X, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { CalendarDay, MealPlan } from '../../types';
import ScheduleDishModal from './ScheduleDishModal';
import { translatedMockDishes } from '../../data/translatedMockData';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import toast from 'react-hot-toast';

export default function MealPlanCalendar() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const { translateDish } = useTranslatedContent();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get days from previous month to fill the grid
    const prevMonth = new Date(year, month - 1, 0);
    const daysFromPrevMonth = startingDayOfWeek;
    
    const days: CalendarDay[] = [];
    
    // Previous month days
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      days.push({
        date: dateString,
        meals: state.mealPlan.filter(meal => meal.date === dateString),
        isToday: false,
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = dateString === today.toISOString().split('T')[0];
      
      days.push({
        date: dateString,
        meals: state.mealPlan.filter(meal => meal.date === dateString),
        isToday,
        isCurrentMonth: true,
      });
    }
    
    // Next month days to complete the grid (42 days total)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateString = date.toISOString().split('T')[0];
      days.push({
        date: dateString,
        meals: state.mealPlan.filter(meal => meal.date === dateString),
        isToday: false,
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [currentDate, state.mealPlan]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleQuickSchedule = (date: string) => {
    if (state.selectedDishes.length === 0) {
      toast.error(t('mealPlan.noSelectedDishes'));
      return;
    }
    
    // Use the first selected dish for quick scheduling
    const dish = state.selectedDishes[0];
    setSelectedDish(dish);
    setShowScheduleModal(true);
  };

  const handleRemoveMeal = (mealId: string) => {
    dispatch({ type: 'REMOVE_MEAL_PLAN', payload: mealId });
    toast.success(t('mealPlan.mealRemoved'));
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dinner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'snack': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const weekDays = [
    t('calendar.sunday'),
    t('calendar.monday'),
    t('calendar.tuesday'),
    t('calendar.wednesday'),
    t('calendar.thursday'),
    t('calendar.friday'),
    t('calendar.saturday'),
  ];

  const monthNames = [
    t('calendar.january'),
    t('calendar.february'),
    t('calendar.march'),
    t('calendar.april'),
    t('calendar.may'),
    t('calendar.june'),
    t('calendar.july'),
    t('calendar.august'),
    t('calendar.september'),
    t('calendar.october'),
    t('calendar.november'),
    t('calendar.december'),
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-primary text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="h-6 w-6" />
              <h2 className="text-2xl font-heading font-bold">
                {t('mealPlan.mealPlanCalendar')}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-primary-dark rounded-lg transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="px-4 py-2 bg-primary-dark rounded-lg">
                <span className="font-heading font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </div>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-primary-dark rounded-lg transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="p-3 text-center font-body font-semibold text-gray-600 bg-gray-50 rounded-lg">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border rounded-lg transition-all hover:bg-gray-50 ${
                  day.isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                } ${day.isToday ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-body font-medium ${
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${day.isToday ? 'text-primary font-bold' : ''}`}>
                    {new Date(day.date).getDate()}
                  </span>
                  {day.isCurrentMonth && (
                    <button
                      onClick={() => handleQuickSchedule(day.date)}
                      className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all"
                      title={t('mealPlan.addMeal')}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Meals */}
                <div className="space-y-1">
                  {day.meals.slice(0, 2).map((meal) => (
                    <div
                      key={meal.id}
                      className={`group relative p-1.5 rounded text-xs border ${getMealTypeColor(meal.mealType)}`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{getMealTypeIcon(meal.mealType)}</span>
                        <span className="font-medium truncate flex-1">
                          {meal.dish.title}
                        </span>
                        <button
                          onClick={() => handleRemoveMeal(meal.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-200 rounded transition-all"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      {meal.servings !== meal.dish.servings && (
                        <div className="flex items-center space-x-1 mt-1 text-xs opacity-75">
                          <Users className="h-2.5 w-2.5" />
                          <span>{meal.servings}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {day.meals.length > 2 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{day.meals.length - 2} {t('common.more')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span>🌅</span>
              <span className="font-body">{t('mealPlan.breakfast')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>☀️</span>
              <span className="font-body">{t('mealPlan.lunch')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🌙</span>
              <span className="font-body">{t('mealPlan.dinner')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🍎</span>
              <span className="font-body">{t('mealPlan.snack')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Dish Modal */}
      {selectedDish && (
        <ScheduleDishModal
          dish={selectedDish}
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedDish(null);
          }}
        />
      )}
    </>
  );
}