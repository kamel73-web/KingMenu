// src/App.tsx
import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { AppProvider, useApp } from "./context/AppContext";
import { useRTL } from "./hooks/useRTL";
import Navbar from "./components/Layout/Navbar";
import LoginForm from "./components/Auth/LoginForm";
import PublicLandingPage from "./pages/PublicLandingPage";
import HomePage from "./pages/HomePage";
import UseMyIngredientsPage from "./pages/UseMyIngredientsPage";
import ProfileView from "./components/Profile/ProfileView";
import FavoritesView from "./components/Favorites/FavoritesView";
import ShoppingListView from "./components/ShoppingList/ShoppingListView";
import MyRecipesPage from "./pages/MyRecipesPage";
import MealPlanPage from "./pages/MealPlanPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DeleteAccount from "./pages/DeleteAccount";
import TermsOfUse from "./pages/TermsOfUse";
import DishPage from "./pages/DishPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PricingPage from "./pages/PricingPage";
import RefundPolicy from "./pages/RefundPolicy";
import "./i18n";
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { supabase } from "./lib/supabase";
import toast from "react-hot-toast";

// Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-600 p-4 text-center">
          Une erreur inattendue s'est produite.<br />
          Veuillez recharger la page.
        </div>
      );
    }
    return this.props.children;
  }
}

function AppRoutes() {
  const { state } = useApp();
  const { isRTL } = useRTL();
  useTranslation();
  const navigate = useNavigate();

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
          toast.success("Connexion Google réussie");
          navigate('/meal-plan', { replace: true });
        }
      } catch (err) {
        console.error("Erreur deep-link OAuth:", err);
        toast.error("Échec connexion après retour");
      }
    }).then(h => { listenerHandle = h; });
    return () => { listenerHandle?.remove(); };
  }, [navigate]);

  // Redirection automatique après login
  React.useEffect(() => {
    if (state.user) {
      // Avec HashRouter, la route est dans window.location.hash (#/login, #/welcome, etc.)
      const hash = window.location.hash.replace('#', '') || '/';
      const publicPaths = ['/welcome', '/login', '/', ''];
      if (publicPaths.some(p => hash === p || hash.startsWith(p + '?'))) {
        navigate('/', { replace: true });
      }
    }
  }, [state.user, navigate]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent mb-4" />
        <p className="text-gray-600 font-medium">Vérification session...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`}>
      <ErrorBoundary>
        {state.user && <Navbar />}
        <Routes key={state.user ? 'protected' : 'public'}>
          <Route path="/welcome" element={state.user ? <Navigate to="/meal-plan" replace /> : <PublicLandingPage />} />
          <Route path="/" element={state.user ? <HomePage /> : <Navigate to="/welcome" replace />} />
          <Route path="/use-my-ingredients" element={state.user ? <UseMyIngredientsPage /> : <Navigate to="/welcome" replace />} />
          <Route path="/meal-plan" element={state.user ? <MealPlanPage /> : <Navigate to="/welcome" replace />} />
          <Route path="/profile" element={state.user ? <ProfileView /> : <Navigate to="/welcome" replace />} />
          <Route path="/favorites" element={state.user ? <FavoritesView /> : <Navigate to="/welcome" replace />} />
          <Route path="/my-recipes" element={state.user ? <MyRecipesPage /> : <Navigate to="/welcome" replace />} />
          <Route path="/shopping-list" element={state.user ? <ShoppingListView /> : <Navigate to="/welcome" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dish/:id" element={state.user ? <DishPage /> : <Navigate to="/welcome" replace />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<Navigate to={state.user ? "/meal-plan" : "/welcome"} replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

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
          style: { background: "#363636", color: "#fff" },
          success: { style: { background: "#22C55E" } },
          error: { style: { background: "#EF4444" } },
        }}
      />
    </AppProvider>
  );
}
