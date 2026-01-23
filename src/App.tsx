// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
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

// Contenus légaux
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";

import "./i18n";

function AppRoutes() {
  const { state } = useApp();
  const { i18n } = useTranslation();
  const { isRTL } = useRTL();
  const navigate = useNavigate();
  const location = useLocation();

  const [hasRedirected, setHasRedirected] = useState(false);

  /** 🌍 Charger langue + direction */
  useEffect(() => {
    const savedLanguage = localStorage.getItem("gusto-language");
    const savedDirection = localStorage.getItem("gusto-direction");

    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }

    if (savedDirection) {
      document.documentElement.dir = savedDirection;
      document.documentElement.classList.toggle(
        "rtl",
        savedDirection === "rtl"
      );
    }
  }, [i18n]);

  /** 🚀 Redirection automatique après login */
  useEffect(() => {
    if (state.user && !hasRedirected) {
      if (location.pathname === "/login" || location.pathname === "/welcome") {
        navigate("/");
        setHasRedirected(true);
      }
    }
  }, [state.user, hasRedirected, location.pathname, navigate]);

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`}>
      {/* Navbar visible uniquement si connecté */}
      {state.user && <Navbar />}

      <Routes>
        {/* 🔓 Landing publique */}
        <Route
          path="/welcome"
          element={!state.user ? <PublicLandingPage /> : <Navigate to="/" />}
        />

        {/* 🔐 Routes protégées */}
        <Route
          path="/"
          element={state.user ? <HomePage /> : <Navigate to="/welcome" />}
        />
        <Route
          path="/use-my-ingredients"
          element={
            state.user ? (
              <UseMyIngredientsPage />
            ) : (
              <Navigate to="/welcome" />
            )
          }
        />
        <Route
          path="/meal-plan"
          element={state.user ? <MealPlanPage /> : <Navigate to="/welcome" />}
        />
        <Route
          path="/profile"
          element={state.user ? <ProfileView /> : <Navigate to="/welcome" />}
        />
        <Route
          path="/favorites"
          element={state.user ? <FavoritesView /> : <Navigate to="/welcome" />}
        />
        <Route
          path="/my-recipes"
          element={state.user ? <MyRecipesPage /> : <Navigate to="/welcome" />}
        />
        <Route
          path="/shopping-list"
          element={
            state.user ? <ShoppingListView /> : <Navigate to="/welcome" />
          }
        />

        {/* 🔓 Routes publiques */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={state.user ? "/" : "/welcome"} />}
        />
      </Routes>
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
