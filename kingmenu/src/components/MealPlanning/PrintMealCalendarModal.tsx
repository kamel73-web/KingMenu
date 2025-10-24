import React, { useState, useRef } from 'react';
import { X, Printer, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { MealPlan } from '../../types';
import { generateMealCalendarPDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';

interface PrintMealCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrintMealCalendarModal({ isOpen, onClose }: PrintMealCalendarModalProps) {
  const { state } = useApp();
  const { t, i18n } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);
  
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(nextMonth.toISOString().split('T')[0]);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  // Filter meals within date range
  const filteredMeals = state.mealPlan.filter(meal => {
    const mealDate = new Date(meal.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return mealDate >= start && mealDate <= end;
  });

  // Group meals by date
  const mealsByDate = filteredMeals.reduce((acc, meal) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {} as Record<string, MealPlan[]>);

  // Generate date range
  const generateDateRange = () => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
    
    return dates;
  };

  const handlePrint = () => {
    if (filteredMeals.length === 0) {
      toast.error(t('mealPlan.print.noMealsInRange'));
      return;
    }

    window.print();
  };

  const handleDownloadPDF = () => {
    if (filteredMeals.length === 0) {
      toast.error(t('mealPlan.print.noMealsInRange'));
      return;
    }

    const translations = {
      title: t('mealPlan.print.title'),
      dateRange: t('mealPlan.print.dateRange'),
      generatedOn: t('common.generatedOn'),
      totalMeals: t('mealPlan.totalMeals'),
      breakfast: t('mealPlan.breakfast'),
      lunch: t('mealPlan.lunch'),
      dinner: t('mealPlan.dinner'),
      snack: t('mealPlan.snack'),
      servings: t('dish.servings'),
      cookingTime: t('dish.cookingTime'),
      noMeals: t('mealPlan.print.noMealsForDay')
    };

    generateMealCalendarPDF(
      startDate,
      endDate,
      mealsByDate,
      i18n.language,
      translations
    );

    toast.success(t('mealPlan.print.downloadedPDF'));
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(i18n.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const dateRange = generateDateRange();

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Printer className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-heading font-bold text-gray-900">
                {t('mealPlan.print.title')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Date Range Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-gray-700 mb-2">
                  {t('mealPlan.print.startDate')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-gray-700 mb-2">
                  {t('mealPlan.print.endDate')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-heading font-bold text-primary">
                    {dateRange.length}
                  </div>
                  <div className="text-sm text-gray-600 font-body">
                    {t('mealPlan.print.daysSelected')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-heading font-bold text-green-600">
                    {filteredMeals.length}
                  </div>
                  <div className="text-sm text-gray-600 font-body">
                    {t('mealPlan.totalMeals')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-heading font-bold text-blue-600">
                    {Object.keys(mealsByDate).length}
                  </div>
                  <div className="text-sm text-gray-600 font-body">
                    {t('mealPlan.print.daysWithMeals')}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Toggle */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                {showPreview ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="font-body font-medium">
                  {showPreview ? t('mealPlan.print.hidePreview') : t('mealPlan.print.showPreview')}
                </span>
              </button>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto bg-white">
                <div ref={printRef} className="print-content">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                      {t('mealPlan.print.title')}
                    </h1>
                    <p className="text-gray-600 font-body">
                      {t('mealPlan.print.dateRange')}: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 font-body">
                      {t('common.generatedOn')}: {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {dateRange.map(date => {
                      const dateString = date.toISOString().split('T')[0];
                      const dayMeals = mealsByDate[dateString] || [];

                      return (
                        <div key={dateString} className="border-b border-gray-200 pb-4">
                          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-3">
                            {formatDate(date)}
                          </h3>
                          
                          {dayMeals.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {dayMeals.map(meal => (
                                <div key={meal.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <span className="text-lg">{getMealTypeIcon(meal.mealType)}</span>
                                  <div className="flex-1">
                                    <div className="font-body font-medium text-gray-900">
                                      {meal.dish.title}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {t(`mealPlan.${meal.mealType}`)} • {meal.servings} {t('dish.servings')} • {meal.dish.cookingTime}m
                                    </div>
                                    {meal.notes && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {meal.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 font-body text-sm italic">
                              {t('mealPlan.print.noMealsForDay')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-body font-medium hover:bg-gray-50 transition-all"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={filteredMeals.length === 0}
                className="flex-1 py-3 px-4 bg-accent text-white rounded-lg font-body font-medium hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>{t('mealPlan.print.downloadPDF')}</span>
              </button>
              <button
                onClick={handlePrint}
                disabled={filteredMeals.length === 0}
                className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-body font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>{t('mealPlan.print.print')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
          }
          .print-content h1 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .print-content h3 {
            font-size: 16px;
            margin-bottom: 8px;
            page-break-after: avoid;
          }
          .print-content .space-y-4 > div {
            page-break-inside: avoid;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </>
  );
}