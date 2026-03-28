import { useState, useRef } from 'react';
import { X, Printer, Calendar, Download, Eye, EyeOff, ChefHat, Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { MealPlan } from '../../types';
import { generateMealCalendarPDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';

interface PrintMealCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEAL_META: Record<string, { icon: string; color: string }> = {
  breakfast: { icon: '🌅', color: 'text-amber-700' },
  lunch:     { icon: '☀️', color: 'text-blue-700' },
  dinner:    { icon: '🌙', color: 'text-purple-700' },
  snack:     { icon: '🍎', color: 'text-green-700' },
};

export default function PrintMealCalendarModal({ isOpen, onClose }: PrintMealCalendarModalProps) {
  const { state } = useApp();
  const { t, i18n } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(nextWeek.toISOString().split("T")[0]);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const filteredMeals = state.mealPlan.filter(meal => {
    const d = new Date(meal.date);
    return d >= new Date(startDate) && d <= new Date(endDate);
  });

  const mealsByDate = filteredMeals.reduce((acc, meal) => {
    if (!acc[meal.date]) acc[meal.date] = [];
    acc[meal.date].push(meal);
    return acc;
  }, {} as Record<string, MealPlan[]>);

  const dateRange: Date[] = [];
  for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d));
  }

  const totalCookTime = filteredMeals.reduce((s, m) => s + m.dish.cookingTime, 0);

  const formatDate = (date: Date) =>
    date.toLocaleDateString(i18n.language, { weekday: "long", day: "numeric", month: "long" });

  const handleDownloadPDF = () => {
    if (filteredMeals.length === 0) { toast.error(t("mealPlan.print.noMealsInRange")); return; }
    generateMealCalendarPDF(startDate, endDate, mealsByDate, i18n.language, {
      title: t("mealPlan.print.title", "Planning des repas"),
      dateRange: t("mealPlan.print.dateRange", "Période"),
      generatedOn: t("common.generatedOn", "Généré le"),
      totalMeals: t("mealPlan.totalMeals", "Repas"),
      breakfast: t("mealPlan.breakfast", "Petit-déjeuner"),
      lunch: t("mealPlan.lunch", "Déjeuner"),
      dinner: t("mealPlan.dinner", "Dîner"),
      snack: t("mealPlan.snack", "Collation"),
      servings: t("dish.servings", "portions"),
      cookingTime: t("dish.cookingTime", "Temps"),
      noMeals: t("mealPlan.print.noMealsForDay"),
    });
    toast.success("PDF téléchargé !");
  };

  const handlePrint = () => {
    if (filteredMeals.length === 0) { toast.error(t("mealPlan.print.noMealsInRange")); return; }
    setShowPreview(true);
    setTimeout(() => {
      const el = printRef.current;
      if (!el) return;
      const html = el.innerHTML;
      const win = window.open('', '_blank', 'width=800,height=600');
      if (!win) return;
      win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
        <title>Planning des repas</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; color: #1e1e28; }
          h1 { font-size: 20px; color: #5e2eed; margin-bottom: 4px; }
          .day-card { margin-bottom: 12px; border: 1px solid #dcdaeb; border-radius: 8px; overflow: hidden; }
          .day-header { background: #ede9fe; padding: 6px 12px; font-weight: bold; font-size: 11px; color: #5e2eed; }
          .meal-row { display: flex; align-items: center; padding: 5px 12px; font-size: 11px; border-top: 1px solid #f5f5f8; }
          .meal-row:nth-child(even) { background: #f8f8fa; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; margin-right: 8px; min-width: 52px; text-align: center; }
          .dish-title { flex: 1; }
          .meta { color: #787882; font-size: 10px; margin-left: 8px; }
          .empty { padding: 6px 12px; font-style: italic; color: #aaaa; font-size: 10px; }
          .footer { margin-top: 20px; text-align: center; font-size: 9px; color: #aaa; border-top: 1px solid #eee; padding-top: 8px; }
          .stats { display: flex; gap: 12px; margin-bottom: 16px; }
          .stat-box { flex: 1; border: 1px solid #dcdaeb; border-radius: 8px; padding: 8px; text-align: center; }
          .stat-val { font-size: 18px; font-weight: bold; color: #5e2eed; }
          .stat-lbl { font-size: 9px; color: #aaa; text-transform: uppercase; }
          @media print { body { margin: 10px; } }
        </style></head><body>${html}</body></html>`);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); win.close(); }, 400);
    }, 200);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

          <div className="bg-gradient-to-r from-violet-600 to-purple-500 px-6 pt-6 pb-5 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Printer className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-white font-bold text-xl">
                  {t("mealPlan.print.title", "Planning des repas")}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <p className="text-purple-200 text-sm">Générez et imprimez votre planning</p>
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {t("mealPlan.print.startDate", "Date de début")}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-violet-400 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {t("mealPlan.print.endDate", "Date de fin")}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-violet-400 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-violet-700">{dateRange.length}</p>
                <p className="text-xs text-violet-500 mt-0.5">Jours</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{filteredMeals.length}</p>
                <p className="text-xs text-green-500 mt-0.5">Repas</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-orange-700">{totalCookTime}m</p>
                <p className="text-xs text-orange-500 mt-0.5">En cuisine</p>
              </div>
            </div>

            <button onClick={() => setShowPreview(v => !v)}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-violet-400 hover:text-violet-600 transition-all text-sm font-medium">
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
            </button>

            {showPreview && (
              <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                <div ref={printRef} className="print-content p-5 space-y-4 bg-white">
                  <div className="text-center pb-4 border-b-2 border-gray-100">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <ChefHat className="h-6 w-6 text-violet-600" />
                      <h1 className="text-xl font-bold text-gray-900">Planning des repas</h1>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(startDate).toLocaleDateString(i18n.language, { day: "numeric", month: "long", year: "numeric" })}
                      {" → "}
                      {new Date(endDate).toLocaleDateString(i18n.language, { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>

                  {filteredMeals.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">{t('mealPlan.print.noMealsInRange')}</p>
                  ) : (
                    dateRange.map(date => {
                      const ds = date.toISOString().split("T")[0];
                      const dayMeals = (mealsByDate[ds] || []).sort((a, b) => {
                        const order = ["breakfast", "lunch", "snack", "dinner"];
                        return order.indexOf(a.mealType) - order.indexOf(b.mealType);
                      });
                      return (
                        <div key={ds} className="rounded-2xl overflow-hidden border border-gray-100">
                          <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-2.5 border-b border-violet-100">
                            <h3 className="font-semibold text-gray-800 text-sm capitalize">{formatDate(date)}</h3>
                          </div>
                          {dayMeals.length === 0 ? (
                            <p className="px-4 py-3 text-xs text-gray-400 italic">{t('mealPlan.print.noMealsForDay')}</p>
                          ) : (
                            <div className="divide-y divide-gray-50">
                              {dayMeals.map(meal => {
                                const meta = MEAL_META[meal.mealType] ?? MEAL_META.dinner;
                                return (
                                  <div key={meal.id} className="flex items-center gap-3 px-4 py-3">
                                    <span className="text-lg flex-shrink-0">{meta.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900 text-sm truncate">{meal.dish.title}</p>
                                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                                        <span className={"font-medium " + meta.color}>{t("mealPlan." + meal.mealType)}</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{meal.dish.cookingTime} min</span>
                                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{meal.servings} pers.</span>
                                      </div>
                                      {meal.notes && <p className="text-xs text-gray-400 mt-0.5 italic">💬 {meal.notes}</p>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div className="text-center pt-2 text-xs text-gray-400 border-t border-gray-100">
                    KingMenu — Généré le {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 flex-shrink-0">
            <button onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all text-sm">
              Annuler
            </button>
            <button onClick={handleDownloadPDF} disabled={filteredMeals.length === 0}
              className="flex-1 py-3 bg-violet-600 text-white rounded-2xl font-semibold hover:bg-violet-700 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-40 shadow-md shadow-violet-200">
              <Download className="h-4 w-4" />PDF
            </button>
            <button onClick={handlePrint} disabled={filteredMeals.length === 0}
              className="flex-1 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-40 shadow-md shadow-orange-200">
              <Printer className="h-4 w-4" />Imprimer
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body > * { display: none !important; }
          .print-content { display: block !important; position: fixed; top: 0; left: 0; width: 100%; padding: 20px; font-size: 11px; background: white; }
        }
      ` }} />
    </>
  );
}
