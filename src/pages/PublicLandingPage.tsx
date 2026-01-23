import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Carrot,
  ShoppingCart,
  CookingPot,
  CalendarDays,
} from "lucide-react";

const PublicLandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("gusto-language", lang);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/Background%20v2.jpg')",
        }}
      />
      <div className="fixed inset-0 bg-black/55" />

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-5 sm:px-8 py-12 pb-32">
        <div className="w-full max-w-3xl text-center">
          {/* Logo */}
          <img
            src="https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/logo%20KM.jpg"
            alt={t("landing.logoAlt") || "King Menu Logo"}
            className="mx-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full shadow-2xl mb-8 object-cover ring-2 ring-yellow-400/30"
          />

          {/* Language selector */}
          <div className="flex justify-center flex-wrap gap-2.5 mb-8">
            {["en", "fr", "es", "it", "ar"].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition
                  ${
                    i18n.language === lang
                      ? "bg-yellow-500 text-white shadow-lg"
                      : "bg-white/90 text-gray-900 hover:bg-white"
                  }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl">
            {t("landing.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-100 mb-12 max-w-2xl mx-auto drop-shadow">
            {t("landing.subtitle")}
          </p>

          {/* Features */}
          <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 sm:p-8 mb-14 shadow-2xl border border-white/10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              {t("landing.featuresTitle")}
            </h2>
            <h1 className="text-4xl text-red-500">
               TEST VERSION NOUVELLE
             </h1>
            <ul className="space-y-4 text-left text-gray-100 text-base sm:text-lg max-w-md mx-auto">
              <li className="flex items-center gap-3">
                <CookingPot className="w-5 h-5 text-yellow-400" />
                <span>{t("landing.featureRecipes")}</span>
              </li>

              <li className="flex items-center gap-3">
                <Carrot className="w-5 h-5 text-yellow-400" />
                <span>{t("landing.featureIngredients")}</span>
              </li>

              <li className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-yellow-400" />
                <span>{t("landing.featurePlanner")}</span>
              </li>

              <li className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-yellow-400" />
                <span>{t("landing.featureShoppingList")}</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-16">
            <button
              onClick={() => navigate("/login")}
              className="
                bg-yellow-500 hover:bg-yellow-600
                text-white text-lg sm:text-xl font-bold
                px-10 py-4 rounded-full
                shadow-xl shadow-yellow-600/40
                transition transform hover:scale-105
                focus:outline-none focus:ring-4 focus:ring-yellow-400
              "
            >
              {t("landing.loginButton")}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
     <footer className="relative z-10 bg-black/70 backdrop-blur-sm px-6 py-6 text-gray-300 border-t border-white/10">
  <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
    <div className="flex gap-4">
      <a href="/privacy" className="hover:text-white hover:underline">
        Privacy Policy
      </a>
      <a href="/terms" className="hover:text-white hover:underline">
        Terms of Use
      </a>
    </div>

    <div className="text-center sm:text-right">
      © {new Date().getFullYear()} King Menu — Plan. Cook. Enjoy
    </div>
  </div>
</footer>
    </div>
  );
};

export default PublicLandingPage;
