import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

interface Ingredient {
  id: string | number;
  name: Record<string, string>;
}

// Normalize i18n.language → 2-letter code ("fr-FR" → "fr")
const shortLang = (lang: string) => lang.split('-')[0];

export default function ProfileView() {
  const { state, dispatch } = useApp();
  const { t, i18n } = useTranslation();
  const lang = shortLang(i18n.language);

  const [ingredients, setIngredients]               = useState<Ingredient[]>([]);
  const [dislikedIngredient, setDislikedIngredient] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [showSuggestions, setShowSuggestions]       = useState(false);

  // ── FIX 2 : dépendre de user.id seulement, pas de l'objet entier
  //    Évite la boucle infinie causée par dispatch(SET_USER) dans l'effet.
  const userId = state.user?.id;

  useEffect(() => {
    if (!userId) return;

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
          .eq('user_id', userId)
          .single();

        if (prefsError && prefsError.code !== 'PGRST116') throw prefsError;

        if (!state.user) return;
        dispatch({
          type: 'SET_USER',
          payload: {
            ...state.user,
            // FIX 1 : tout convertir en string dès le chargement
            dislikedIngredients: (userPrefs?.disliked_ingredients ?? []).map(String),
          },
        });
      } catch (error) {
        toast.error(t('errors.loadUserPreferences'));
        console.error('Error fetching user preferences:', error);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // ← uniquement l'ID, pas state.user

  // ── Suggestions autocomplete ──
  useEffect(() => {
    if (!dislikedIngredient.trim()) {
      setFilteredIngredients([]);
      setShowSuggestions(false);
      return;
    }
    const query = dislikedIngredient.toLowerCase();
    // FIX 3 : utiliser le code court (ex: "fr" et non "fr-FR")
    const matches = ingredients.filter((ingr) => {
      const name = ingr.name?.[lang] || ingr.name?.en || '';
      return name.toLowerCase().includes(query);
    });
    setFilteredIngredients(matches);
    setShowSuggestions(true);
  }, [dislikedIngredient, ingredients, lang]);

  const saveUserPreferences = async (newPrefs: { disliked_ingredients?: string[] }) => {
    if (!state.user) return false;
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ user_id: state.user.id, ...newPrefs }, { onConflict: 'user_id' });
      if (error) throw error;
      return true;
    } catch (error) {
      toast.error(t('errors.updatePreferences'));
      console.error('Error saving preferences:', error);
      return false;
    }
  };

  const handleAddDislikedIngredient = async () => {
    if (!state.user) return;

    const selected = filteredIngredients.find(
      (ingr) => (ingr.name[lang] || ingr.name.en) === dislikedIngredient
    );
    if (!selected) {
      toast.error(t('profile.invalidIngredient'));
      return;
    }

    const selectedId = String(selected.id);

    // FIX 4 : éviter les doublons
    if ((state.user.dislikedIngredients || []).includes(selectedId)) {
      toast.error(t('profile.ingredientAdded')); // déjà présent
      setDislikedIngredient('');
      setShowSuggestions(false);
      return;
    }

    const newDisliked = [...(state.user.dislikedIngredients || []), selectedId];
    const ok = await saveUserPreferences({ disliked_ingredients: newDisliked });
    if (!ok) return;

    dispatch({ type: 'SET_USER', payload: { ...state.user, dislikedIngredients: newDisliked } });
    setDislikedIngredient('');
    setShowSuggestions(false);
    toast.success(t('profile.ingredientAdded'));
  };

  const handleRemoveDislikedIngredient = async (ingredientId: string) => {
    if (!state.user) return;
    const newDisliked = (state.user.dislikedIngredients || []).filter(
      (id: string) => id !== ingredientId
    );
    const ok = await saveUserPreferences({ disliked_ingredients: newDisliked });
    if (!ok) return;
    dispatch({ type: 'SET_USER', payload: { ...state.user, dislikedIngredients: newDisliked } });
    toast.success(t('profile.ingredientRemoved'));
  };

  // ── Helpers ──
  // FIX 1 : comparaison String(ing.id) === ingredientId
  const findIngredient = (id: string) =>
    ingredients.find((ing) => String(ing.id) === id);

  const getIngredientName = (ingr: Ingredient) =>
    ingr.name[lang] || ingr.name.en || String(ingr.id);

  const renderSuggestions = () => {
    if (!showSuggestions || !filteredIngredients.length) return null;
    return (
      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
        {filteredIngredients.map((ingr) => (
          <li
            key={ingr.id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-body"
            onMouseDown={() => {
              setDislikedIngredient(getIngredientName(ingr));
              setShowSuggestions(false);
            }}
          >
            {getIngredientName(ingr)}
          </li>
        ))}
      </ul>
    );
  };

  // ── Non connecté ──
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

  const dislikedIds: string[] = state.user.dislikedIngredients || [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* ── Compte ── */}
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

      {/* ── Ingrédients non aimés ── */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">
          {t('profile.dislikedIngredients')} ({dislikedIds.length})
        </h2>

        {/* Champ + suggestions */}
        <div className="relative mb-3">
          <input
            type="text"
            value={dislikedIngredient}
            onChange={(e) => setDislikedIngredient(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddDislikedIngredient()}
            placeholder={t('profile.addIngredientPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            autoComplete="off"
            onFocus={() => dislikedIngredient.trim() && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            aria-label={t('profile.addIngredientPlaceholder')}
          />
          {renderSuggestions()}
        </div>

        <button
          onClick={handleAddDislikedIngredient}
          disabled={!dislikedIngredient.trim()}
          className="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-body font-medium disabled:opacity-40 disabled:cursor-not-allowed mb-6"
        >
          {t('profile.add')}
        </button>

        {/* Liste des ingrédients non aimés */}
        {dislikedIds.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {dislikedIds.map((ingredientId) => {
              // FIX 1 appliqué via findIngredient()
              const ingr = findIngredient(ingredientId);
              const name = ingr ? getIngredientName(ingr) : ingredientId;
              return (
                <div
                  key={ingredientId}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <span className="font-body font-medium text-gray-900 truncate mr-2">
                    {name}
                  </span>
                  <button
                    onClick={() => handleRemoveDislikedIngredient(ingredientId)}
                    className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                    // FIX 5 : clé profile.removeIngredient maintenant présente dans les JSON
                    aria-label={t('profile.removeIngredient', { name })}
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
