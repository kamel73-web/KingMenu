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
    <div className="relative min-h-screen flex flex-col">
      {/* Image de fond sans bg-fixed (problème principal) */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/Background%20v2.jpg')",
        }}
      />
      
      {/* Overlay sombre positionné fixe */}
      <div className="fixed inset-0 bg-black/55 z-0" />

      {/* Contenu principal avec z-index plus élevé */}
      <main className="relative z-10 flex-grow flex flex-col px-5 sm:px-8 py-10 md:py-16">
        <div className="flex flex-col items-center justify-center flex-grow">
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

            {/* Zone bouton - avec marge garantie */}
            <div className="mt-12 mb-8 sm:mb-12 flex justify-center">
              <button
                onClick={() => navigate("/login")}
                className="
                  bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
                  text-white text-lg sm:text-xl font-bold
                  px-8 sm:px-10 py-4 sm:py-5 rounded-full
                  shadow-xl shadow-yellow-600/40 hover:shadow-2xl
                  transition-all duration-200 transform hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-4 focus:ring-yellow-400
                  relative z-20
                "
              >
                {t("landing.loginButton")}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer avec position relative et marge garantie */}
      <footer className="relative z-10 bg-black/70 backdrop-blur-sm px-6 py-6 text-gray-300 border-t border-white/10 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          {/* Liens légaux */}
          <div className="flex gap-4 order-2 sm:order-1">
            <a
              href="/privacy"
              className="hover:text-white underline-offset-4 hover:underline transition"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-white underline-offset-4 hover:underline transition"
            >
              Terms of Use
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-center sm:text-left order-1 sm:order-2 mb-2 sm:mb-0">
            © {new Date().getFullYear()} King Menu — Plan. Cook. Enjoy
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
