import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Clock, Users, Star, Check, X, Eye, Plus } from 'lucide-react';
import { DishMatch, OwnedIngredient } from '../../types';
import { useApp } from '../../context/AppContext';
import RecipeModal from '../Recipe/RecipeModal';
import CookModeModal from '../Recipe/CookModeModal';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface DishMatchResultsProps {
  matches: DishMatch[];
  ownedIngredients: OwnedIngredient[];
  onBack: () => void;
}

export default function DishMatchResults({ matches, ownedIngredients, onBack }: DishMatchResultsProps) {
  const { t, i18n } = useTranslation();

  // Résoudre le nom traduit d'un ingrédient
  const resolveName = (name: any): string => {
    if (typeof name === 'string') return name;
    if (name && typeof name === 'object') {
      return name[i18n.language] ?? name.fr ?? name.en ?? '';
    }
    return '';
  };

  const { dispatch } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'perfect' | 'near' | 'creative'>('all');
  const [selectedRecipeDish, setSelectedRecipeDish] = useState<any>(null);
  const [cookModeDish, setCookModeDish] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  // Assurer que les traductions sont prêtes avant le rendu
  useEffect(() => {
    if (i18n.isInitialized) setIsReady(true);
  }, [i18n]);

  const filteredMatches = matches.filter(match => {
    if (filterType === 'all') return true;
    return match.matchType === filterType;
  });

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case 'perfect': return t('matchType.perfect');
      case 'near': return t('matchType.near');
      case 'creative': return t('matchType.creative');
      default: return '';
    }
  };

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'perfect': return 'bg-accent-50 text-accent-700 border-accent-100';
      case 'near': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'creative': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-neutral-100 text-content-title border-neutral-200';
    }
  };

  const handleAddDish = (dish: any) => {
    dispatch({ type: 'ADD_DISH', payload: dish });
    toast.success(t('addedToMenu', { title: dish.title }));
  };

  const perfectMatches = matches.filter(m => m.matchType === 'perfect').length;
  const nearMatches = matches.filter(m => m.matchType === 'near').length;
  const creativeMatches = matches.filter(m => m.matchType === 'creative').length;

  if (!isReady) return <div>{t('loading')}</div>; // Afficher un état de chargement temporaire

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-content-muted" />
            </button>
            <div>
              <h2 className="text-2xl font-heading font-bold text-content-title">
                {t('dishMatches')}
              </h2>
              <p className="text-content-muted font-body">
                {t('basedOnIngredients', { count: ownedIngredients.length })}
              </p>
            </div>
          </div>

          {/* Match Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <div className="text-2xl font-heading font-bold text-content-title">
                {matches.length}
              </div>
              <div className="text-sm text-content-muted font-body">{t('totalMatches')}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-heading font-bold text-green-600">
                {perfectMatches}
              </div>
              <div className="text-sm text-content-muted font-body">{t('perfectMatches')}</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-heading font-bold text-yellow-600">
                {nearMatches}
              </div>
              <div className="text-sm text-content-muted font-body">{t('nearMatches')}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-heading font-bold text-blue-600">
                {creativeMatches}
              </div>
              <div className="text-sm text-content-muted font-body">{t('creativeMatches')}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: t('allResults') },
              { key: 'perfect', label: t('perfectMatches') },
              { key: 'near', label: t('nearMatches') },
              { key: 'creative', label: t('creativeMatches') }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key as any)}
                className={`px-4 py-2 rounded-lg font-body font-medium transition-all ${
                  filterType === filter.key
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-content-body hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map(match => (
              <div key={match.dish.id} className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-soft transition-all">
                <div className="relative">
                  <img
                    src={match.dish.image}
                    alt={match.dish.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-body font-medium border ${getMatchTypeColor(match.matchType)}`}>
                      {getMatchTypeLabel(match.matchType)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs font-body font-bold text-primary">
                        {Math.round(match.compatibilityScore)}% match
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-heading font-semibold text-lg text-content-title mb-2">
                    {match.dish.title}
                  </h3>

                  <div className="flex items-center space-x-4 text-sm text-content-muted mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{match.dish.cookingTime}m</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{match.dish.servings}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{match.dish.rating}</span>
                    </div>
                  </div>

                  {/* Ingredient Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-body font-medium text-content-body">
                        {t('ingredients')}
                      </span>
                      <span className="text-xs text-content-muted">
                        {match.availableIngredients.length}/{match.dish.ingredients.length}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {match.availableIngredients.slice(0, 3).map(ingredient => (
                        <div key={ingredient.id} className="flex items-center space-x-2 text-xs">
                          <Check className="h-3 w-3 text-green-500" />
                          <span className="text-content-body">{resolveName(ingredient.name)}</span>
                        </div>
                      ))}
                      
                      {match.missingIngredients.slice(0, 2).map(ingredient => (
                        <div key={ingredient.id} className="flex items-center space-x-2 text-xs">
                          <X className="h-3 w-3 text-red-500" />
                          <span className="text-content-muted">{t('recipe.needIngredient', { name: resolveName(ingredient.name), defaultValue: 'Manquant : ' + resolveName(ingredient.name) })}</span>
                        </div>
                      ))}
                      
                      {match.missingIngredients.length > 2 && (
                        <div className="text-xs text-content-muted">
                          {t('moreNeeded', { count: match.missingIngredients.length - 2 })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 sm:space-x-3">
                    {/* Mobile: Round buttons */}
                    <div className="flex sm:hidden justify-between items-center w-full px-2">
                      <button
                        onClick={() => setSelectedRecipeDish(match.dish)}
                        className="w-11 h-11 border-2 border-gray-300 text-content-muted rounded-full hover:bg-neutral-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center shadow-sm"
                        title={t('recipe.recipe', 'Voir la recette')}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleAddDish(match.dish)}
                        className="w-11 h-11 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full hover:from-primary-dark hover:to-primary transition-all duration-200 flex items-center justify-center shadow-card transform hover:scale-105"
                        title={t('recipe.addToMenu', 'Ajouter au menu')}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Desktop: Rectangle buttons */}
                    <div className="hidden sm:flex space-x-2 w-full">
                    <button
                      onClick={() => setSelectedRecipeDish(match.dish)}
                      className="flex-1 py-2 px-3 border border-gray-300 text-content-body rounded-lg font-body font-medium hover:bg-neutral-50 transition-all"
                    >
                      {t('recipe.recipe', 'Voir la recette')}
                    </button>
                    <button
                      onClick={() => handleAddDish(match.dish)}
                      className="flex-1 py-2 px-3 bg-primary text-white rounded-lg font-body font-medium hover:bg-primary-dark transition-all"
                    >
                      {t('recipe.addToMenu', 'Ajouter au menu')}
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-content-hint mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-content-title mb-2">
              {t('noMatches')}
            </h3>
            <p className="text-content-muted font-body">
              {t('tryDifferentIngredients')}
            </p>
          </div>
        )}
      </div>

      {/* Recipe Modal */}
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

      {/* Cook Mode Modal */}
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