import React, { useEffect, useState } from 'react';
import { Clock, Users, ChefHat, Printer, Download, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dish, Ingredient } from '@/types';
import { generateRecipePDF } from '@/utils/pdfGenerator';
import toast from 'react-hot-toast';
import { getIngredientsForDish } from '@/lib/supabase';

interface RecipeViewerProps {
  dishes: Dish[];
  selectedDish: Dish | null;
  setSelectedDish: (dish: Dish) => void;
  servings: number;
  setServings: (servings: number) => void;
  onPrint: () => void;
}

const RecipeViewer: React.FC<RecipeViewerProps> = ({
  dishes,
  selectedDish,
  setSelectedDish,
  servings,
  setServings,
  onPrint,
}) => {
  const { t, i18n } = useTranslation();
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  const handleDishSelection = async (dish: Dish) => {
    setLoadingIngredients(true);
    const ingredients = await getIngredientsForDish(dish.id, i18n.language);
    setSelectedDish({
      ...dish,
      ingredients,
    });
    setServings(dish.servings);
    setLoadingIngredients(false);
  };

  const handleDownload = async () => {
    if (!selectedDish) return;
    const pdfBlob = await generateRecipePDF(selectedDish, servings, i18n.language);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDish.name?.[i18n.language] || 'recipe'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!selectedDish) return;
    try {
      const pdfBlob = await generateRecipePDF(selectedDish, servings, i18n.language);
      const file = new File([pdfBlob], `${selectedDish.name?.[i18n.language] || 'recipe'}.pdf`, {
        type: 'application/pdf',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: selectedDish.name?.[i18n.language] || 'Recipe',
          text: t('share_recipe'),
        });
      } else {
        toast.error(t('share_not_supported'));
      }
    } catch (error) {
      toast.error(t('share_failed'));
    }
  };

  useEffect(() => {
    if (dishes.length > 0) {
      handleDishSelection(dishes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishes, i18n.language]);

  if (!selectedDish) {
    return <div className="p-4">{t('no_recipe_selected')}</div>;
  }

  const { name, cookingTime, servings: baseServings, difficulty, steps, ingredients } = selectedDish;

  const adjustedIngredients = (ingredients || []).map((ingredient: Ingredient) => ({
    ...ingredient,
    amount: ((parseFloat(ingredient.amount || '1') * servings) / baseServings).toFixed(2),
  }));

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{name?.[i18n.language] || name?.en || 'Recipe'}</h2>
        <div className="flex gap-2">
          <button onClick={onPrint} className="btn btn-secondary" title={t('print')}>
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={handleDownload} className="btn btn-secondary" title={t('download')}>
            <Download className="w-4 h-4" />
          </button>
          <button onClick={handleShare} className="btn btn-secondary" title={t('share')}>
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {cookingTime} {t('minutes')}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          {servings} {t('servings')}
        </div>
        <div className="flex items-center gap-2">
          <ChefHat className="w-4 h-4" />
          {t(difficulty)}
        </div>
        <div className="flex items-center gap-2">
          <span>{t('select_recipe')}:</span>
          <select
            value={selectedDish.id}
            onChange={(e) => {
              const dish = dishes.find((d) => d.id === Number(e.target.value));
              if (dish) handleDishSelection(dish);
            }}
            className="border rounded px-2 py-1"
          >
            {dishes.map((dish) => (
              <option key={dish.id} value={dish.id}>
                {dish.name?.[i18n.language] || dish.name?.en || 'Recipe'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="servings" className="block font-medium">
          {t('adjust_servings')}:
        </label>
        <input
          id="servings"
          type="number"
          value={servings}
          min={1}
          onChange={(e) => setServings(Number(e.target.value))}
          className="mt-1 border px-2 py-1 rounded w-24"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold">{t('ingredients')}</h3>
        {loadingIngredients ? (
          <p>{t('loading')}...</p>
        ) : (
          <ul className="list-disc list-inside">
            {adjustedIngredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold">{t('instructions')}</h3>
        <ol className="list-decimal list-inside space-y-1">
          {steps?.[i18n.language]?.map((step: string, index: number) => (
            <li key={index}>{step}</li>
          )) || <p>{t('no_steps')}</p>}
        </ol>
      </div>
    </div>
  );
};

export default RecipeViewer;
