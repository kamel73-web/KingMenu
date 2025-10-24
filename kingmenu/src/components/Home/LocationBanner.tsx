import React from 'react';
import { MapPin, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';

export default function LocationBanner() {
  const { state } = useApp();
  const { t } = useTranslation();

  return (
    <div className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 sm:px-8 animate-fade-in">
        {/* Section gauche */}
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full shadow-soft">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-lg sm:text-xl">{t('location.yourLocation')}</p>
            <p className="text-sm sm:text-base opacity-90">
              {state.location || t('location.detecting')}
            </p>
          </div>
        </div>

        {/* Bouton réglages */}
        <button
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/40"
          title={t('location.settings')}
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
