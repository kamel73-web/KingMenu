import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Share2, Copy, Check, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import RecipeModal from '../Recipe/RecipeModal';
import CookModeModal from '../Recipe/CookModeModal';
import { Dish } from '../../types';
import { generateShoppingListPDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';

export default function ShoppingListView() {
  const { state, dispatch } = useApp();
  const { t, i18n } = useTranslation();
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [selectedRecipeDish, setSelectedRecipeDish] = useState<Dish | null>(null);
  const [cookModeDish, setCookModeDish] = useState<Dish | null>(null);

  const unownedIngredients = state.shoppingList.filter(i => !i.isOwned);
  const ownedIngredients = state.shoppingList.filter(i => i.isOwned);

  const handleToggleOwned = (ingredientId: string) => {
    dispatch({ type: 'TOGGLE_INGREDIENT_OWNED', payload: ingredientId });
  };

  const findDishByIngredient = (ingredientName: string): Dish | null =>
    state.selectedDishes.find(d =>
      d.ingredients.some(i => i.name.toLowerCase() === ingredientName.toLowerCase())
    ) || null;

  const generatePDF = () => {
    const title = t('shoppingList.title');
    const translations = {
      generatedOn: t('common.generatedOn'),
      totalItems: t('common.totalItems'),
      itemsToBuyTitle: t('shoppingList.itemsToBuyTitle'),
    };

    generateShoppingListPDF(title, unownedIngredients, i18n.language, translations);
    toast.success(t('shoppingList.downloadedPDF'));
  };

  const generateTextList = () => {
    const header = `${t('shoppingList.title')}\n${t('common.generatedOn')}: ${new Date().toLocaleDateString()}\n\n`;
    const items = unownedIngredients
      .map(i => `☐ ${i.name} - ${i.amount || ''} ${i.unit || ''}`)
      .join('\n');
    return header + items;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateTextList());
      setCopiedToClipboard(true);
      toast.success(t('shoppingList.copied'));
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      toast.error(t('common.error'));
    }
  };

  const shareList = async () => {
    const text = generateTextList();
    const title = t('shoppingList.title');

    // Web Share API (mobile natif — Android/iOS)
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        // utilisateur a annulé — ne pas faire de fallback
        return;
      }
    }

    // Fallback desktop : ouvrir un menu de partage manuel
    const encoded = encodeURIComponent(text);
    const titleEncoded = encodeURIComponent(title);

    const options = [
      { label: 'WhatsApp',  url: `https://wa.me/?text=${encoded}` },
      { label: 'Messenger', url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=0&redirect_uri=${encodeURIComponent(window.location.href)}` },
      { label: 'Email',     url: `mailto:?subject=${titleEncoded}&body=${encoded}` },
      { label: 'Telegram',  url: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encoded}` },
      { label: 'Viber',     url: `viber://forward?text=${encoded}` },
    ];

    // Créer un menu contextuel simple
    const existing = document.getElementById('km-share-menu');
    if (existing) { existing.remove(); return; }

    const menu = document.createElement('div');
    menu.id = 'km-share-menu';
    menu.style.cssText = `
      position: fixed; bottom: 80px; right: 20px; z-index: 9999;
      background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: 12px; display: flex; flex-direction: column; gap: 8px; min-width: 180px;
      border: 1px solid #e5e7eb; animation: fadeIn 0.15s ease;
    `;

    const closeOnClick = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeOnClick);
      }
    };
    setTimeout(() => document.addEventListener('click', closeOnClick), 100);

    options.forEach(opt => {
      const btn = document.createElement('a');
      btn.href = opt.url;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.textContent = opt.label;
      btn.style.cssText = `
        display: block; padding: 10px 16px; border-radius: 10px;
        color: #1f2937; text-decoration: none; font-size: 14px; font-weight: 500;
        transition: background 0.15s;
      `;
      btn.onmouseenter = () => { btn.style.background = '#f3f4f6'; };
      btn.onmouseleave = () => { btn.style.background = ''; };
      btn.onclick = () => { setTimeout(() => menu.remove(), 200); };
      menu.appendChild(btn);
    });

    // Bouton copier en bas
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 ' + t('shoppingList.copy');
    copyBtn.style.cssText = `
      padding: 10px 16px; border-radius: 10px; border: none; cursor: pointer;
      background: #f3f4f6; color: #1f2937; font-size: 14px; font-weight: 500;
      text-align: left; transition: background 0.15s;
    `;
    copyBtn.onclick = () => { copyToClipboard(); menu.remove(); };
    menu.appendChild(copyBtn);

    document.body.appendChild(menu);
  };

  if (state.shoppingList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛒</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            {t('shoppingList.noShoppingList')}
          </h2>
          <p className="text-gray-600 font-body mb-6">
            {t('shoppingList.noShoppingListDesc')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            {t('shoppingList.browseDishes')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* --- Header --- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                {t('shoppingList.title')}
              </h1>
              {/* ✅ Sous-titre ajouté ici */}
              <p className="text-gray-500 font-body mb-3">
                {t('shoppingList.subtitle')}
              </p>

              <p className="text-gray-600 font-body">
                {unownedIngredients.length} {t('shoppingList.itemsToBuy')} •{' '}
                {ownedIngredients.length} {t('shoppingList.itemsYouHave')}
              </p>
            </div>

            {/* --- Boutons d’export --- */}
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              {/* Télécharger PDF */}
              <button
                onClick={generatePDF}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Download className="h-4 w-4" />
                <span className="font-body font-medium">{t('shoppingList.pdf')}</span>
              </button>

              {/* Copier */}
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                {copiedToClipboard ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="font-body font-medium">
                  {copiedToClipboard ? t('shoppingList.copied') : t('shoppingList.copy')}
                </span>
              </button>

              {/* Partager */}
              <button
                onClick={shareList}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span className="font-body font-medium">{t('shoppingList.share')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- Liste des ingrédients --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* À acheter */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
              {t('shoppingList.itemsToBuyTitle')} ({unownedIngredients.length})
            </h2>

            {unownedIngredients.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {unownedIngredients.map(ingredient => {
                  const sourceDish = findDishByIngredient(ingredient.name);
                  return (
                    <div
                      key={ingredient.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <button
                        onClick={() => handleToggleOwned(ingredient.id)}
                        className="w-5 h-5 border-2 border-gray-300 rounded hover:border-blue-600 transition-colors"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-body font-medium text-gray-900">
                            {ingredient.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {ingredient.amount} {ingredient.unit}
                            </span>
                            {sourceDish && (
                              <button
                                onClick={() => setSelectedRecipeDish(sourceDish)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-all"
                                title={`${t('common.from')} ${sourceDish.title}`}
                              >
                                <ChefHat className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 capitalize">
                            {ingredient.category}
                          </span>
                          {sourceDish && (
                            <span className="text-xs text-gray-400">
                              {t('common.from')} {sourceDish.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 font-body text-center py-8">
                {t('shoppingList.allItemsOwned')}
              </p>
            )}
          </div>

          {/* En stock */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
              {t('shoppingList.itemsYouHaveTitle')} ({ownedIngredients.length})
            </h2>

            {ownedIngredients.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {ownedIngredients.map(ingredient => {
                  const sourceDish = findDishByIngredient(ingredient.name);
                  return (
                    <div
                      key={ingredient.id}
                      className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <button
                        onClick={() => handleToggleOwned(ingredient.id)}
                        className="w-5 h-5 bg-green-500 border-2 border-green-500 rounded flex items-center justify-center"
                      >
                        <Check className="h-3 w-3 text-white" />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-body font-medium text-gray-900 line-through">
                            {ingredient.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {ingredient.amount} {ingredient.unit}
                            </span>
                            {sourceDish && (
                              <button
                                onClick={() => setSelectedRecipeDish(sourceDish)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-all"
                                title={`${t('common.from')} ${sourceDish.title}`}
                              >
                                <ChefHat className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 capitalize">
                            {ingredient.category}
                          </span>
                          {sourceDish && (
                            <span className="text-xs text-gray-400">
                              {t('common.from')} {sourceDish.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 font-body text-center py-8">
                {t('shoppingList.noItemsOwned')}
              </p>
            )}
          </div>
        </div>

        {/* --- Dishes sélectionnés --- */}
        {state.selectedDishes.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
              {t('shoppingList.selectedDishes')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.selectedDishes.map(dish => (
                <div
                  key={dish.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body font-medium text-gray-900 truncate">
                      {dish.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {dish.cuisine} • {dish.servings} {t('dish.servings')}
                    </p>
                  </div>
                  <button
                    onClick={() => setCookModeDish(dish)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title={t('dish.cookMode')}
                  >
                    <ChefHat className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- Modales --- */}
      {selectedRecipeDish && (
        <RecipeModal
          dish={selectedRecipeDish}
          isOpen={!!selectedRecipeDish}
          onClose={() => setSelectedRecipeDish(null)}
          onEnterCookMode={() => {
            setSelectedRecipeDish(null);
            setCookModeDish(selectedRecipeDish);
          }}
        />
      )}

      {cookModeDish && (
        <CookModeModal
          dish={cookModeDish}
          isOpen={!!cookModeDish}
          onClose={() => setCookModeDish(null)}
        />
      )}
    </>
  );
}
