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
      className="relative min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/Background%20v2.jpg')",
      }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/55 z-0" />

      {/* Contenu principal avec flex-grow */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-start px-5 sm:px-8 py-10 md:py-16">
        <div className="w-full max-w-3xl text-center">
          {/* Logo */}
          <img
            src="https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/logo%20KM.jpg"
            alt={t("landing.logoAlt") || "King Menu Logo"}
            className="mx-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full shadow-2xl mb-6 sm:mb-8 object-cover ring-2 ring-yellow-400/30"
          />

          {/* Sélecteur de langue */}
          <div className="flex justify-center flex-wrap gap-2.5 sm:gap-3 mb-7 sm:mb-9">
            {["en", "fr", "es", "it", "ar"].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`
                  px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black/40
                  ${
                    i18n.language === lang
                      ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30"
                      : "bg-white/85 text-gray-900 hover:bg-white hover:shadow-md"
                  }
                `}
                aria-pressed={i18n.language === lang}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Titre */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl mb-5">
            {t("landing.title")}
          </h1>

          {/* Sous-titre */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12 drop-shadow-md">
            {t("landing.subtitle")}
          </p>

          {/* Bloc fonctionnalités */}
          <div className="bg-black/35 backdrop-blur-lg rounded-3xl p-6 sm:p-8 mb-10 sm:mb-12 shadow-2xl border border-white/10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5">
              {t("landing.featuresTitle")}
            </h2>
            <ul className="space-y-3 sm:space-y-4 text-left text-gray-100 text-base sm:text-lg max-w-md mx-auto">
              <li>🍲 {t("landing.featureRecipes")}</li>
              <li>🥕 {t("landing.featureIngredients")}</li>
              <li>📅 {t("landing.featurePlanner")}</li>
              <li>🛒 {t("landing.featureShoppingList")}</li>
            </ul>
          </div>

          {/* Bouton principal – plus gros sur mobile */}
          <button
            onClick={() => navigate("/login")}
            className={`
              bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
              text-white text-lg sm:text-xl font-bold
              px-8 sm:px-10 py-4 sm:py-5 rounded-full
              shadow-xl shadow-yellow-600/40 hover:shadow-2xl
              transition-all duration-200 transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-4 focus:ring-offset-black/50
            `}
          >
            {t("landing.loginButton")}
          </button>
        </div>
      </main>

      {/* Footer – plus lisible, contraste amélioré */}
      <footer className="relative z-10 bg-black/60 backdrop-blur-sm py-5 px-6 text-center text-gray-200 text-sm sm:text-base border-t border-white/10">
        © {new Date().getFullYear()} King Menu — {t("landing.footer")}
      </footer>
    </div>
  );
};

export default PublicLandingPage;
