import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import { translatedCuisineTypes } from '../../data/translatedMockData';

export default function PreferenceSelector() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const { translateCuisine } = useTranslatedContent();

  const handlePreferenceToggle = (cuisine: string) => {
    if (!state.user) return;

    const currentPreferences = state.user.preferences;
    const newPreferences = currentPreferences.includes(cuisine)
      ? currentPreferences.filter(p => p !== cuisine)
      : [...currentPreferences, cuisine];

    dispatch({
      type: 'SET_USER',
      payload: {
        ...state.user,
        preferences: newPreferences,
      },
    });
  };

  const translatedCuisines = translatedCuisineTypes.map(cuisine => translateCuisine(cuisine));

  return (
    <div className="bg-white rounded-3xl shadow-soft p-8 mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-2xl font-heading font-bold text-warm-gray-900">
          {t('preferences.culinaryPreferences')}
        </h3>
        {isExpanded ? (
          <ChevronUp className="h-6 w-6 text-primary-500" />
        ) : (
          <ChevronDown className="h-6 w-6 text-primary-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 animate-slide-up">
          <p className="text-warm-gray-600 font-body mb-6 text-base">
            {t('preferences.selectFavorites')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {translatedCuisines.map((cuisine) => (
              <button
                key={cuisine.id}
                onClick={() => handlePreferenceToggle(cuisine.name)}
                className={`p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                  state.user?.preferences.includes(cuisine.name)
                    ? 'border-primary-500 bg-primary-500 text-white shadow-medium'
                    : 'border-warm-gray-200 bg-white text-warm-gray-700 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <div className="text-3xl mb-2">{cuisine.icon}</div>
                <div className="font-body font-semibold text-sm">{cuisine.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}