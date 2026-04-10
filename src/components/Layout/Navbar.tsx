// src/components/Layout/Navbar.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import TodayMenuModal from '../MealPlanning/TodayMenuModal';
import {
  Home, User, Heart, ShoppingCart, LogOut, Utensils,
  ChefHat, Sparkles, Calendar, UtensilsCrossed, MoreHorizontal,
  X, Globe,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { signOut } from '../../lib/supabase';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import toast from 'react-hot-toast';

// ─── Helpers ────────────────────────────────────────────────────────────────

function useClickOutside(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, cb]);
}

// ─── Badge pill ──────────────────────────────────────────────────────────────

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-secondary-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none shadow-md">
      {count > 99 ? '99+' : count}
    </span>
  );
}

// ─── Avatar initiales ────────────────────────────────────────────────────────

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initial = name.charAt(0).toUpperCase();
  const cls = size === 'sm'
    ? 'w-8 h-8 text-xs'
    : 'w-10 h-10 text-sm';
  return (
    <div className={`${cls} bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-medium shrink-0`}>
      <span className="text-white font-heading font-bold">{initial}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { t } = useTranslation();

  const [showTodayMenu, setShowTodayMenu]   = useState(false);
  const [profileOpen, setProfileOpen]       = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const profileRef   = useRef<HTMLDivElement>(null!);
  const mobileMoreRef = useRef<HTMLDivElement>(null!);

  useClickOutside(profileRef,    () => setProfileOpen(false));
  useClickOutside(mobileMoreRef, () => setMobileMoreOpen(false));

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMealsCount = state.mealPlan.filter(m => m.date === todayStr).length;

  const handleLogout = async () => {
    try {
      setProfileOpen(false);
      setMobileMoreOpen(false);
      const { error } = await signOut();
      if (error) { toast.error(error.message); return; }
      dispatch({ type: 'SET_USER',          payload: null });
      dispatch({ type: 'CLEAR_SELECTED_DISHES' });
      dispatch({ type: 'SET_MEAL_PLAN',     payload: [] });
      toast.success(t('navigation.logoutSuccess'));
      navigate('/welcome', { replace: true });
    } catch {
      toast.error(t('common.error'));
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // ── 4 liens principaux – toujours visibles ────────────────────────────────
  const primaryLinks = [
    {
      path: '/',
      icon: Home,
      label: t('navigation.home'),
      badge: 0,
    },
    {
      path: '/use-my-ingredients',
      icon: Sparkles,
      label: t('navigation.useMyIngredients'),
      badge: 0,
    },
    {
      path: '/meal-plan',
      icon: Calendar,
      label: t('navigation.mealPlan'),
      badge: state.mealPlan.length,
    },
    {
      path: '/shopping-list',
      icon: ShoppingCart,
      label: t('navigation.shoppingList'),
      badge: state.shoppingList.filter(i => !i.isOwned).length,
    },
  ];

  // ── Liens secondaires – dans le menu profil (desktop) / "Plus" (mobile) ──
  const secondaryLinks = [
    {
      path: '/my-recipes',
      icon: ChefHat,
      label: t('navigation.myRecipes'),
      badge: state.selectedDishes.length,
    },
    {
      path: '/favorites',
      icon: Heart,
      label: t('navigation.favorites'),
      badge: 0,
    },
    {
      path: '/profile',
      icon: User,
      label: t('navigation.profile'),
      badge: 0,
    },
  ];

  const totalSecondaryBadge = state.selectedDishes.length;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP Navbar (md+)
      ══════════════════════════════════════════════════════════════════ */}
      <nav className="hidden md:flex bg-white/95 backdrop-blur-md shadow-soft border-b border-warm-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">

            {/* Logo avec Archivo Black (au lieu de Playfair Display) */}
            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <div className="relative">
                <Utensils className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors duration-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
              {/* Utilisation de font-heading qui pointe vers Archivo Black */}
              <span className="text-2xl font-heading bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent tracking-tight">
                {t('brand.name')}
              </span>
              <span className="hidden lg:block text-sm text-warm-gray-600 font-body font-medium">
                {t('brand.tagline')}
              </span>
            </Link>

            {/* Liens principaux */}
            <div className="flex items-center space-x-1">
              {primaryLinks.map(({ path, icon: Icon, label, badge }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
                    isActive(path)
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-warm-gray-600 hover:text-primary-500 hover:bg-primary-50'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-semibold text-sm whitespace-nowrap font-body">{label}</span>
                  <Badge count={badge} />
                </Link>
              ))}

              {/* Menu du jour */}
              <button
                onClick={() => setShowTodayMenu(true)}
                className="relative flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 text-warm-gray-600 hover:text-secondary-500 hover:bg-secondary-50"
              >
                <UtensilsCrossed className="h-5 w-5 shrink-0" />
                <span className="font-semibold text-sm whitespace-nowrap font-body">
                  {t('navigation.todayMenu', "Menu du jour")}
                </span>
                <Badge count={todayMealsCount} />
              </button>
            </div>

            {/* Avatar + menu déroulant profil */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                  profileOpen
                    ? 'bg-primary-50 ring-2 ring-primary-200 shadow-card'
                    : 'hover:bg-warm-gray-100'
                }`}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <Avatar name={state.user?.name ?? '?'} />
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-warm-gray-900 leading-tight max-w-[120px] truncate font-subheading">
                    {state.user?.name}
                  </p>
                  <p className="text-xs text-warm-gray-500 leading-tight font-body">
                    {state.user?.location ?? state.user?.email}
                  </p>
                </div>
                {totalSecondaryBadge > 0 && (
                  <span className="w-2 h-2 rounded-full bg-secondary-500" />
                )}
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-2xl shadow-elevated border border-warm-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-3 border-b border-warm-gray-100">
                    <p className="font-subheading font-bold text-warm-gray-900 truncate">
                      {state.user?.name}
                    </p>
                    <p className="text-xs text-warm-gray-500 truncate font-body">{state.user?.email}</p>
                  </div>

                  <div className="py-1">
                    {secondaryLinks.map(({ path, icon: Icon, label, badge }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center justify-between px-4 py-2.5 transition-all duration-200 ${
                          isActive(path)
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-warm-gray-700 hover:bg-warm-gray-50 hover:pl-5'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="text-sm font-semibold font-body">{label}</span>
                        </div>
                        {badge > 0 && (
                          <span className="min-w-[20px] h-5 px-1.5 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>

                  <div className="px-4 py-2 border-t border-warm-gray-100 flex items-center space-x-2 text-warm-gray-600">
                    <Globe className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-semibold font-body">{t('navigation.language', 'Langue')}</span>
                    <div className="ml-auto">
                      <LanguageSelector />
                    </div>
                  </div>

                  <div className="py-1 border-t border-warm-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200 hover:pl-5"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-semibold font-body">{t('navigation.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE : top bar + bottom tab bar
      ══════════════════════════════════════════════════════════════════ */}

      <header className="md:hidden bg-white/95 backdrop-blur-md shadow-soft border-b border-warm-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Utensils className="h-7 w-7 text-primary-500" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary-500 rounded-full" />
            </div>
            {/* Logo mobile avec Archivo Black */}
            <span className="text-xl font-heading bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent tracking-tight">
              {t('brand.name')}
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTodayMenu(true)}
              className="relative p-2 text-warm-gray-600 hover:text-secondary-500 hover:bg-secondary-50 rounded-full transition-all duration-300"
            >
              <UtensilsCrossed className="h-5 w-5" />
              <Badge count={todayMealsCount} />
            </button>

            <button onClick={() => navigate('/profile')} className="relative">
              <Avatar name={state.user?.name ?? '?'} size="sm" />
            </button>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-warm-gray-100 pb-safe">
        <div className="grid grid-cols-5 h-16">

          {primaryLinks.map(({ path, icon: Icon, label, badge }) => (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                isActive(path)
                  ? 'text-primary-500'
                  : 'text-warm-gray-500 hover:text-primary-400'
              }`}
            >
              {isActive(path) && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-b-full" />
              )}
              <div className="relative">
                <Icon className="h-5 w-5" />
                <Badge count={badge} />
              </div>
              <span className="text-[10px] font-semibold leading-none truncate max-w-[56px] text-center font-body">
                {label.split(' ')[0]}
              </span>
            </Link>
          ))}

          <div className="relative flex flex-col items-center justify-center" ref={mobileMoreRef}>
            <button
              onClick={() => setMobileMoreOpen(v => !v)}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full transition-all duration-300 ${
                mobileMoreOpen ? 'text-primary-500' : 'text-warm-gray-500'
              }`}
            >
              <div className="relative">
                {mobileMoreOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
                {!mobileMoreOpen && <Badge count={totalSecondaryBadge} />}
              </div>
              <span className="text-[10px] font-semibold leading-none font-body">
                {mobileMoreOpen ? t('common.close', 'Fermer') : t('navigation.more', 'Plus')}
              </span>
            </button>

            {mobileMoreOpen && (
              <div className="absolute bottom-[calc(100%+8px)] right-0 w-56 bg-white rounded-2xl shadow-elevated border border-warm-gray-100 py-2 z-50">
                {secondaryLinks.map(({ path, icon: Icon, label, badge }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMoreOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 transition-all duration-200 ${
                      isActive(path)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-warm-gray-700 hover:bg-warm-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-semibold font-body">{label}</span>
                    </div>
                    {badge > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {badge}
                      </span>
                    )}
                  </Link>
                ))}

                <div className="border-t border-warm-gray-100 px-4 py-2 flex items-center space-x-2 text-warm-gray-600">
                  <Globe className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-semibold font-body">{t('navigation.language', 'Langue')}</span>
                  <div className="ml-auto">
                    <LanguageSelector />
                  </div>
                </div>

                <div className="border-t border-warm-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-semibold font-body">{t('navigation.logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="md:hidden h-16" />

      <TodayMenuModal isOpen={showTodayMenu} onClose={() => setShowTodayMenu(false)} />
    </>
  );
}
