// src/App.tsx
import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AppProvider, useApp } from './context/AppContext';
import { useRTL } from './hooks/useRTL';
import { useMealPlan } from './hooks/useMealPlan';
import Navbar from './components/Layout/Navbar';
import LoginForm from './components/Auth/LoginForm';
import PublicLandingPage from './pages/PublicLandingPage';
import HomePage from './pages/HomePage';
import UseMyIngredientsPage from './pages/UseMyIngredientsPage';
import ProfileView from './components/Profile/ProfileView';
import FavoritesView from './components/Favorites/FavoritesView';
import ShoppingListView from './components/ShoppingList/ShoppingListView';
import MyRecipesPage from './pages/MyRecipesPage';
import MealPlanPage from './pages/MealPlanPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import './i18n';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { supabase } from './lib/supabase';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────
// Error Boundary
// CORRIGÉ : message traduit via un composant fonctionnel enfant
// ─────────────────────────────────────────────────────────────

const ErrorFallbackMessage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-600 p-4 text-center gap-4">
      <div className="text-5xl">⚠️</div>
      <p className="text-lg font-semibold">
        {t('common.unexpectedError', 'Une erreur inattendue s\'est produite.')}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
      >
        {t('common.reload', 'Recharger la page')}
      </button>
    </div>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackMessage />;
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────
// Routes principale
// ─────────────────────────────────────────────────────────────

function AppRoutes() {
  const { state } = useApp();
  const { isRTL } = useRTL();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loadMealPlans } = useMealPlan();

  // CORRIGÉ : charger les meal plans dès que l'utilisateur est connecté
  // Unique source de vérité pour cette requête (supprimée d'AppContext)
  React.useEffect(() => {
    if (state.user) {
      loadMealPlans();
    }
  }, [state.user?.id]); // Se relance si l'utilisateur change (pas sur chaque re-render)

  // Listener deep-link OAuth (mobile uniquement)
  React.useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let listenerHandle: { remove: () => void } | null = null;

    CapacitorApp.addListener('appUrlOpen', async (event) => {
      try {
        const url = new URL(event.url);
        const params = new URLSearchParams(url.hash.substring(1));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          toast.success(t('auth.googleSuccess', 'Connexion Google réussie'));
          navigate('/meal-plan', { replace: true });
        }
      } catch (err) {
        console.error('Erreur deep-link OAuth:', err);
        toast.error(t('auth.loginError', 'Échec connexion après retour'));
      }
    }).then((h) => { listenerHandle = h; });

    return () => { listenerHandle?.remove(); };
  }, [navigate, t]);

  // Redirection automatique après login
  React.useEffect(() => {
    if (state.user) {
      const hash = window.location.hash.replace('#', '') || '/';
      const publicPaths = ['/welcome', '/login', '/', ''];
      if (publicPaths.some((p) => hash === p || hash.startsWith(p + '?'))) {
        navigate('/meal-plan', { replace: true });
      }
    }
  }, [state.user, navigate]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent mb-4" />
        <p className="text-gray-600 font-medium">
          {t('common.sessionCheck', 'Vérification session...')}
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <ErrorBoundary>
        {state.user && <Navbar />}
        <Routes key={state.user ? 'protected' : 'public'}>
          <Route
            path="/welcome"
            element={state.user ? <Navigate to="/meal-plan" replace /> : <PublicLandingPage />}
          />
          <Route
            path="/"
            element={state.user ? <HomePage /> : <Navigate to="/welcome" replace />}
          />
          <Route
            path="/use-my-ingredients"
            element={state.user ? <UseMyIngredientsPage /> : <Navigate to="/welcome" replace />}
          />
          <Route
            path="/meal-plan"
            element={state.user ? <MealPlanPage /> : <Navigate to="/welcome" replace />}
          />
          <Route
            path="/profile"
            element={state.user ? <ProfileView /> : <Navigate to="/welcome" replace />}
          />
          <Route
            path="/favorites"
            element={state.user ? <FavoritesView /> : <Navigate to="/welcome" replace />}
          />
          <Route
            path="/my-recipes"
            element={state.user ? <MyRecipesPage /> : <Navigate to="/welcome" replace />}
          />
          <Route
            path="/shopping-list"
            element={state.user ? <ShoppingListView /> : <Navigate to="/welcome" replace />}
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route
            path="*"
            element={<Navigate to={state.user ? '/meal-plan' : '/welcome'} replace />}
          />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: { style: { background: '#22C55E' } },
          error: { style: { background: '#EF4444' } },
        }}
      />
    </AppProvider>
  );
}
