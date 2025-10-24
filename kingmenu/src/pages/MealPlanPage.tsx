import React, { useState } from 'react';
import { Calendar, TrendingUp, Clock, Users, ChefHat, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import MealPlanCalendar from '../components/MealPlanning/MealPlanCalendar';
import PrintMealCalendarModal from '../components/MealPlanning/PrintMealCalendarModal';

export default function MealPlanPage() {
  const { state } = useApp();
  const { t } = useTranslation();
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Calculate meal plan statistics
  const totalMeals = state.mealPlan.length;
  const totalCookingTime = state.mealPlan.reduce((total, meal) => total + meal.dish.cookingTime, 0);
  const totalServings = state.mealPlan.reduce((total, meal) => total + meal.servings, 0);
  const uniqueDishes = new Set(state.mealPlan.map(meal => meal.dish.id)).size;

  // Get upcoming meals (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingMeals = state.mealPlan.filter(meal => {
    const mealDate = new Date(meal.date);
    return mealDate >= today && mealDate <= nextWeek;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">
                  {t('mealPlan.title')}
                </h1>
                <p className="text-gray-600 font-body">
                  {t('mealPlan.description')}
                </p>
              </div>
            </div>

            {/* Print Button */}
            <button
              onClick={() => setShowPrintModal(true)}
              disabled={totalMeals === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="h-4 w-4" />
              <span className="font-body font-medium">{t('mealPlan.print.printCalendar')}</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-heading font-bold text-blue-600 mb-1">
                {totalMeals}
              </div>
              <div className="text-sm text-gray-600 font-body">{t('mealPlan.totalMeals')}</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-heading font-bold text-green-600 mb-1">
                {uniqueDishes}
              </div>
              <div className="text-sm text-gray-600 font-body">{t('mealPlan.uniqueDishes')}</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-heading font-bold text-purple-600 mb-1">
                {totalCookingTime}m
              </div>
              <div className="text-sm text-gray-600 font-body">{t('mealPlan.totalCookingTime')}</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-heading font-bold text-orange-600 mb-1">
                {totalServings}
              </div>
              <div className="text-sm text-gray-600 font-body">{t('mealPlan.totalServings')}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <MealPlanCalendar />
          </div>

          {/* Upcoming Meals Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-heading font-semibold text-gray-900">
                  {t('mealPlan.upcomingMeals')}
                </h3>
              </div>

              {upcomingMeals.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {upcomingMeals.slice(0, 10).map((meal) => (
                    <div key={meal.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                      <div className="flex items-start space-x-3">
                        <img
                          src={meal.dish.image}
                          alt={meal.dish.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-medium text-gray-900 text-sm truncate">
                            {meal.dish.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span>{new Date(meal.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{t(`mealPlan.${meal.mealType}`)}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{meal.dish.cookingTime}m</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{meal.servings}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-body text-sm">
                    {t('mealPlan.noUpcomingMeals')}
                  </p>
                  <p className="text-gray-400 font-body text-xs mt-1">
                    {t('mealPlan.startScheduling')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      <PrintMealCalendarModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
      />
    </>
  );
}