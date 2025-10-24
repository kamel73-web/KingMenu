import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PublicLandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("gusto-language", lang);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-gray-800"
      style={{
        backgroundImage:
          "url('https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/sign/Brand/background.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDFhMTczOS01YTg0LTQ0NmQtODgxMC0wNGRiNjQ2ZGRlMzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJCcmFuZC9iYWNrZ3JvdW5kLmF2aWYiLCJpYXQiOjE3NjExMzg0MDAsImV4cCI6MTc5MjY3NDQwMH0.ONd-VSDJH9-_KNgHZC27ZbGqBr19GaP34kvkir0obDk')",
      }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Logo */}
        <img
          src="https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/sign/Brand/logo%20KM.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDFhMTczOS01YTg0LTQ0NmQtODgxMC0wNGRiNjQ2ZGRlMzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJCcmFuZC9sb2dvIEtNLmpwZyIsImlhdCI6MTc2MTEzOTQ5OCwiZXhwIjoxNzkyNjc1NDk4fQ.Etkb-QlejLXww_i4V0dHvb3zTudbJhbNw-KAjI7pMXQ"
          alt="King Menu Logo"
          className="mx-auto w-32 h-32 rounded-full shadow-lg mb-6 object-cover"
        />

        {/* Titre principal */}
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
          {t("landing.title")}
        </h1>

        {/* Sous-titre */}
        <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed">
          {t("landing.subtitle")}
        </p>

        {/* Bloc des fonctionnalités */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-gray-100 mb-10 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{t("landing.featuresTitle")}</h2>
          <ul className="space-y-2 text-left mx-auto max-w-md">
            <li>🍲 {t("landing.featureRecipes")}</li>
            <li>🥕 {t("landing.featureIngredients")}</li>
            <li>📅 {t("landing.featurePlanner")}</li>
            <li>🛒 {t("landing.featureShoppingList")}</li>
          </ul>
        </div>

        {/* Bouton Connexion */}
        <button
          onClick={() => navigate("/login")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105"
        >
          {t("landing.loginButton")}
        </button>

        {/* Sélecteur de langue */}
        <div className="mt-10 flex justify-center gap-3">
          {["en", "fr", "es", "it", "ar"].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                i18n.language === lang
                  ? "bg-yellow-500 text-white"
                  : "bg-white/20 text-gray-200 hover:bg-white/40"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-300 text-sm">
        © {new Date().getFullYear()} King Menu — {t("landing.footer")}
      </footer>
    </div>
  );
};

export default PublicLandingPage;
