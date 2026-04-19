import { useEffect, useState } from 'react';
import { Clock, Users, ChefHat, Printer, Download, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dish, Ingredient } from '../../types';
import { generateRecipePDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';
import { getIngredientsForDish } from '../../lib/supabase';

export interface RecipeViewerProps {
  dishes: Dish[];
  selectedDish?: Dish | null;
  setSelectedDish?: (dish: Dish) => void;
  servings?: number;
  setServings?: (servings: number) => void;
  onPrint?: () => void;
  onEnterCookMode?: (dish: Dish) => void;
}

export default function RecipeViewer({
  dishes,
  selectedDish: externalSelectedDish,
  setSelectedDish: externalSetSelectedDish,
  servings: externalServings,
  setServings: externalSetServings,
  onPrint,
  onEnterCookMode,
}: RecipeViewerProps) {
  const { t, i18n } = useTranslation();
  const [internalDish, setInternalDish] = useState<Dish | null>(null);
  const [internalServings, setInternalServings] = useState(4);
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  // Support both controlled (external) and uncontrolled (internal) modes
  const selectedDish = externalSelectedDish !== undefined ? externalSelectedDish : internalDish;
  const servings = externalServings !== undefined ? externalServings : internalServings;
  const setSelectedDish = externalSetSelectedDish ?? setInternalDish;
  const setServings = externalSetServings ?? setInternalServings;

  const handleDishSelection = async (dish: Dish) => {
    setLoadingIngredients(true);
    try {
      const ingredients = await getIngredientsForDish(dish.id, i18n.language);
      setSelectedDish({ ...dish, ingredients });
      setServings(dish.servings ?? 4);
    } finally {
      setLoadingIngredients(false);
    }
  };

  const handleDownload = () => {
    if (!selectedDish) return;
    try {
      generateRecipePDF(selectedDish, servings, i18n.language, {
        ingredients: t('recipe.ingredients', 'Ingrédients'),
        instructions: t('recipe.instructions', 'Instructions'),
        step: t('recipe.step', 'Étape'),
        cookingTime: t('dish.cookingTime', 'Temps de cuisson'),
        difficulty: t('dish.difficulty', 'Difficulté'),
        servings: t('dish.servings', 'Portions'),
      });
      toast.success(t('shoppingList.downloadedPDF', 'PDF téléchargé'));
    } catch {
      toast.error(t('common.error', 'Erreur'));
    }
  };

  const handleShare = async () => {
    if (!selectedDish) return;
    const text = `${selectedDish.title}\n\n${
      selectedDish.ingredients.map(i => `• ${i.amount} ${i.unit} ${i.name}`).join('\n')
    }\n\n${selectedDish.instructions.join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: selectedDish.title, text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success(t('shoppingList.copied', 'Copié'));
    }
  };

  useEffect(() => {
    if (dishes.length > 0 && !selectedDish) {
      handleDishSelection(dishes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishes, i18n.language]);

  if (!selectedDish) {
    return <div className="p-4 text-content-muted">{t('common.loading', 'Chargement...')}</div>;
  }

  const baseServings = selectedDish.servings ?? 4;
  const adjustedIngredients: Ingredient[] = (selectedDish.ingredients || []).map(ingredient => ({
    ...ingredient,
    amount: (
      (parseFloat(ingredient.amount || '1') * servings) / baseServings
    ).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1'),
  }));

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-content-title">{selectedDish.title}</h2>
        <div className="flex gap-2">
          {onPrint && (
            <button onClick={onPrint} className="p-2 text-content-muted hover:bg-neutral-100 rounded-lg transition-all" title={t('print', 'Imprimer')}>
              <Printer className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleDownload} className="p-2 text-content-muted hover:bg-neutral-100 rounded-lg transition-all" title={t('download', 'Télécharger')}>
            <Download className="w-4 h-4" />
          </button>
          <button onClick={handleShare} className="p-2 text-content-muted hover:bg-neutral-100 rounded-lg transition-all" title={t('share', 'Partager')}>
            <Share2 className="w-4 h-4" />
          </button>
          {onEnterCookMode && (
            <button onClick={() => onEnterCookMode(selectedDish)} className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-all" title={t('dish.cookMode', 'Mode cuisson')}>
              <ChefHat className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-content-muted">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-500" />
          <span>{selectedDish.cookingTime} {t('dish.minutes', 'min')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary-500" />
          <span>{servings} {t('dish.servings', 'portions')}</span>
        </div>
        <div className="flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-primary-500" />
          <span>{selectedDish.difficulty}</span>
        </div>
      </div>

      {/* Dish selector (when multiple dishes) */}
      {dishes.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-content-body mb-1">
            {t('select_recipe', 'Choisir une recette')}
          </label>
          <select
            value={selectedDish.id}
            onChange={e => {
              const dish = dishes.find(d => d.id === e.target.value);
              if (dish) handleDishSelection(dish);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
          >
            {dishes.map(dish => (
              <option key={dish.id} value={dish.id}>{dish.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Servings adjuster */}
      <div className="flex items-center gap-3">
        <label htmlFor="servings" className="text-sm font-medium text-content-body">
          {t('adjust_servings', 'Ajuster les portions')} :
        </label>
        <input
          id="servings"
          type="number"
          value={servings}
          min={1}
          max={20}
          onChange={e => setServings(Math.max(1, Number(e.target.value)))}
          className="border border-gray-300 rounded-lg px-2 py-1 w-20 text-sm"
        />
      </div>

      {/* Ingredients */}
      <div>
        <h3 className="text-lg font-semibold text-content-title mb-2">{t('recipe.ingredients', 'Ingrédients')}</h3>
        {loadingIngredients ? (
          <p className="text-content-muted text-sm">{t('common.loading', 'Chargement...')}</p>
        ) : (
          <ul className="space-y-1">
            {adjustedIngredients.map(ingredient => (
              <li key={ingredient.id} className="flex items-center gap-2 text-sm text-content-body">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0" />
                <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>
                <span>{ingredient.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Instructions */}
      <div>
        <h3 className="text-lg font-semibold text-content-title mb-2">{t('recipe.instructions', 'Instructions')}</h3>
        {selectedDish.instructions?.length > 0 ? (
          <ol className="space-y-2">
            {selectedDish.instructions.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm text-content-body">
                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-content-muted text-sm">{t('no_steps', 'Aucune instruction disponible.')}</p>
        )}
      </div>
    </div>
  );
}
