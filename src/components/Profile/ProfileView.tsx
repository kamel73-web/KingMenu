import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

interface Ingredient {
  id: string | number;
  name: Record<string, string>;
}

export default function ProfileView() {
  const { state, dispatch } = useApp();
  const { t, i18n } = useTranslation();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dislikedIngredient, setDislikedIngredient] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!state.user) return;
    async function fetchData() {
      try {
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('ingredients')
          .select('id, name');
        if (ingredientsError) throw ingredientsError;
        setIngredients(ingredientsData || []);

        const { data: userPrefs, error: prefsError } = await supabase
          .from('user_preferences')
          .select('disliked_ingredients')
          .eq('user_id', state.user.id)
          .single();
        if (prefsError && prefsError.code !== 'PGRST116') {
          throw prefsError;
        }
        dispatch({
          type: 'SET_USER',
          payload: {
            ...state.user,
            dislikedIngredients: userPrefs?.disliked_ingredients ?? [],
          },
        });
      } catch (error) {
        toast.error(t('errors.loadUserPreferences'));
        console.error('Error fetching user preferences:', error);
      }
    }
    fetchData();
  }, [state.user, dispatch, t]);

  useEffect(() => {
    if (!dislikedIngredient.trim()) {
      setFilteredIngredients([]);
      setShowSuggestions(false);
      return;
    }
    const query = dislikedIngredient.toLowerCase();
    const lang = i18n.language;
    const matches = ingredients.filter((ingr) => {
      const nameInLang = ingr.name?.[lang] || ingr.name?.en || '';
      return nameInLang.toLowerCase().includes(query);
    });
    setFilteredIngredients(matches);
    setShowSuggestions(true);
  }, [dislikedIngredient, ingredients, i18n.language]);

  const saveUserPreferences = async (newPrefs: {
    disliked_ingredients?: string[];
  }) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          { user_id: state.user.id, ...newPrefs },
          { onConflict: 'user_id' }
        );
      if (error) throw error;
      return true;
    } catch (error) {
      toast.error(t('errors.updatePreferences'));
      console.error('Error saving preferences:', error);
      return false;
    }
  };

  const handleAddDislikedIngredient = async () => {
    const selected = filteredIngredients.find(
      (ingr) => (ingr.name[i18n.language] || ingr.name.en) === dislikedIngredient
    );
    if (!selected) {
      toast.error(t('profile.invalidIngredient'));
      return;
    }
    const newDisliked = [...(state.user.dislikedIngredients || []), selected.id];
    const ok = await saveUserPreferences({ disliked_ingredients: newDisliked });
    if (!ok) return;
    dispatch({
      type: 'SET_USER',
      payload: { ...state.user, dislikedIngredients: newDisliked },
    });
    setDislikedIngredient('');
    setShowSuggestions(false);
    toast.success(t('profile.ingredientAdded'));
  };

  const handleRemoveDislikedIngredient = async (ingredientId: string) => {
    const newDisliked = (state.user.dislikedIngredients || []).filter(
      (id: string) => id !== ingredientId
    );
    const ok = await saveUserPreferences({ disliked_ingredients: newDisliked });
    if (!ok) return;
    dispatch({
      type: 'SET_USER',
      payload: { ...state.user, dislikedIngredients: newDisliked },
    });
    toast.success(t('profile.ingredientRemoved'));
  };

  const renderSuggestions = () => {
    if (!showSuggestions || !filteredIngredients.length) return null;
    return (
      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
        {filteredIngredients.map((ingr) => (
          <li
            key={ingr.id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-body"
            onMouseDown={() => {
              setDislikedIngredient(ingr.name[i18n.language] || ingr.name.en);
              setShowSuggestions(false);
            }}
          >
            {ingr.name[i18n.language] || ingr.name.en}
          </li>
        ))}
      </ul>
    );
  };

  if (!state.user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
          {t('profile.pleaseLogin')}
        </h2>
        <p className="text-gray-600 font-body">{t('profile.loginPrompt')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">
          {t('profile.accountDetails')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-body font-medium">
              {t('profile.name')}
            </label>
            <p className="text-gray-900 font-body">
              {state.user.name || t('profile.anonymous')}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-body font-medium">
              {t('profile.email')}
            </label>
            <p className="text-gray-900 font-body">{state.user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">
          {t('profile.dislikedIngredients')} ({state.user.dislikedIngredients?.length || 0})
        </h2>
        <div className="relative mb-6">
          <input
            type="text"
            value={dislikedIngredient}
            onChange={(e) => setDislikedIngredient(e.target.value)}
            placeholder={t('profile.addIngredientPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            autoComplete="off"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            aria-label={t('profile.addIngredientPlaceholder')}
          />
          {renderSuggestions()}
        </div>
        <button
          onClick={handleAddDislikedIngredient}
          className="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-body font-medium"
          disabled={!dislikedIngredient}
        >
          {t('profile.add')}
        </button>
        {state.user.dislikedIngredients?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
            {state.user.dislikedIngredients.map((ingredientId: string) => {
              const ingredient = ingredients.find((ing) => ing.id === ingredientId);
              return (
                <div
                  key={ingredientId}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <span className="font-body font-medium text-gray-900">
                    {ingredient ? ingredient.name[i18n.language] || ingredient.name.en : ingredientId}
                  </span>
                  <button
                    onClick={() => handleRemoveDislikedIngredient(ingredientId)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label={t('profile.removeIngredient', {
                      name: ingredient ? ingredient.name[i18n.language] || ingredient.name.en : ingredientId,
                    })}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 font-body text-center py-8">
            {t('profile.noDislikedIngredients')}
          </p>
        )}
      </div>
    </div>
  );
}
