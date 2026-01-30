// src/App.tsx
import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { AppProvider, useApp } from "./context/AppContext";
import { useRTL } from "./hooks/useRTL";

// Layout & pages
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

// Legal
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";

import "./i18n";

/* =========================
   Routes wrapper
========================= */

function AppRoutes() {
  const { state } = useApp();
  const { isRTL } = useRTL();
  useTranslation(); // force init i18n

  /* ⛔ IMPORTANT
     Tant que l’auth Supabase n’est pas résolue,
     ON NE REND PAS LES ROUTES
  */
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`}>
      {/* Navbar uniquement si connecté */}
      {state.user && <Navbar />}

      <Routes>
        {/* 🌍 Landing publique */}
        <Route
          path="/welcome"
          element={
            state.user ? <Navigate to="/" replace /> : <PublicLandingPage />
          }
        />

        {/* 🔐 Routes protégées */}
        <Route
          path="/"
          element={
            state.user ? <HomePage /> : <Navigate to="/welcome" replace />
          }
        />

        <Route
          path="/use-my-ingredients"
          element={
            state.user ? <UseMyIngredientsPage /> : <Navigate to="/welcome" replace />
          }
        />

        <Route
          path="/meal-plan"
          element={
            state.user ? <MealPlanPage /> : <Navigate to="/welcome" replace />
          }
        />

        <Route
          path="/profile"
          element={
            state.user ? <ProfileView /> : <Navigate to="/welcome" replace />
          }
        />

        <Route
          path="/favorites"
          element={
            state.user ? <FavoritesView /> : <Navigate to="/welcome" replace />
          }
        />

        <Route
          path="/my-recipes"
          element={
            state.user ? <MyRecipesPage /> : <Navigate to="/welcome" replace />
          }
        />

        <Route
          path="/shopping-list"
          element={
            state.user ? <ShoppingListView /> : <Navigate to="/welcome" replace />
          }
        />

        {/* 🔓 Routes publiques */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />

        {/* 🔁 Fallback */}
        <Route
          path="*"
          element={<Navigate to={state.user ? "/" : "/welcome"} replace />}
        />
      </Routes>
    </div>
  );
}

/* =========================
   App root
========================= */

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
