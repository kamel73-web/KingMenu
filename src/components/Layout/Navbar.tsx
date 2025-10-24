import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Heart, ShoppingCart, LogOut, Utensils, ChefHat, Sparkles, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { signOut } from '../../lib/supabase';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import toast from 'react-hot-toast';

export default function Navbar() {
  const location = useLocation();
  const { state, dispatch } = useApp();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'CLEAR_SELECTED_DISHES' });
      dispatch({ type: 'SET_MEAL_PLAN', payload: [] });
      toast.success(t('navigation.logout') + ' successful');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { path: '/use-my-ingredients', icon: Sparkles, label: t('navigation.useMyIngredients') },
    { path: '/meal-plan', icon: Calendar, label: t('navigation.mealPlan'), showBadge: state.mealPlan.length > 0 },
    { path: '/profile', icon: User, label: t('navigation.profile') },
    { path: '/favorites', icon: Heart, label: t('navigation.favorites') },
    { path: '/my-recipes', icon: ChefHat, label: t('navigation.myRecipes'), showBadge: state.selectedDishes.length > 0 },
    { path: '/shopping-list', icon: ShoppingCart, label: t('navigation.shoppingList'), showBadge: state.shoppingList.length > 0 },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-soft border-b border-warm-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Utensils className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-2xl font-heading font-bold text-warm-gray-900">
              {t('brand.name')}
            </span>
            <span className="hidden sm:block text-sm text-warm-gray-600 font-semibold">
              {t('brand.tagline')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(({ path, icon: Icon, label, showBadge }) => (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-primary-500 text-white shadow-medium'
                    : 'text-warm-gray-600 hover:text-primary-500 hover:bg-primary-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-semibold">{label}</span>
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {path === '/my-recipes' ? state.selectedDishes.length :
                     path === '/meal-plan' ? state.mealPlan.length :
                     state.shoppingList.length}
                  </span>
                )}
              </Link>
            ))}
            
            <LanguageSelector />
            
            {state.user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-5 py-2.5 text-warm-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-full transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-semibold">{t('navigation.logout')}</span>
              </button>
            )}
          </div>

          {/* User Info */}
          {state.user && (
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-warm-gray-900">
                  {state.user.name}
                </p>
                <p className="text-xs text-warm-gray-500">{state.user.location}</p>
              </div>
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-medium">
                <span className="text-white font-heading font-bold text-sm">
                  {state.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Updated to show all items */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-warm-gray-100">
        <div className="grid grid-cols-4 gap-1 py-3 px-4">
          {/* First row - 4 main items */}
          {navItems.slice(0, 4).map(({ path, icon: Icon, label, showBadge }) => (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center py-3 px-2 rounded-2xl transition-all duration-200 ${
                location.pathname === path
                  ? 'text-primary-500 bg-primary-50'
                  : 'text-warm-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold mt-1 text-center leading-tight">
                {label.split(' ')[0]}
              </span>
              {showBadge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {path === '/my-recipes' ? state.selectedDishes.length :
                   path === '/meal-plan' ? state.mealPlan.length :
                   state.shoppingList.length}
                </span>
              )}
            </Link>
          ))}
        </div>
        
        {/* Second row - remaining items */}
        <div className="grid grid-cols-4 gap-1 py-3 px-4 border-t border-warm-gray-100">
          {navItems.slice(4).map(({ path, icon: Icon, label, showBadge }) => (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center py-3 px-2 rounded-2xl transition-all duration-200 ${
                location.pathname === path
                  ? 'text-primary-500 bg-primary-50'
                  : 'text-warm-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold mt-1 text-center leading-tight">
                {label.includes(' ') ? label.split(' ').slice(0, 2).join(' ') : label}
              </span>
              {showBadge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {path === '/my-recipes' ? state.selectedDishes.length :
                   path === '/meal-plan' ? state.mealPlan.length :
                   state.shoppingList.length}
                </span>
              )}
            </Link>
          ))}
          
          {/* Logout button */}
          {state.user && (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center py-3 px-2 text-warm-gray-600 rounded-2xl hover:bg-primary-50 hover:text-primary-500 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs font-semibold mt-1">{t('navigation.logout')}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
