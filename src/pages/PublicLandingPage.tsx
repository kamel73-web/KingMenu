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
      className="relative min-h-screen flex flex-col items-center bg-cover bg-center text-gray-800"
      style={{
        backgroundImage:
          "url('https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/background.avif')",
      }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center px-6 max-w-3xl mt-16 mb-12">
        {/* Logo */}
        <img
          src="https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/sign/Brand/logo%20KM.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDFhMTczOS01YTg0LTQ0NmQtODgxMC0wNGRiNjQ2ZGRlMzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJCcmFuZC9sb2dvIEtNLmpwZyIsImlhdCI6MTc2MTEzOTQ5OCwiZXhwIjoxNzkyNjc1NDk4fQ.Etkb-QlejLXww_i4V0dHvb3zTudbJhbNw-KAjI7pMXQ"
          alt="King Menu Logo"
          className="mx-auto w-32 h-32 rounded-full shadow-lg mb-3 object-cover"
        />

        {/* ✅ Boutons de langue juste sous la couronne */}
        <div className="flex justify-center gap-2 mb-6">
          {["en", "fr", "es", "it", "ar"].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                i18n.language === lang
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-white/80 text-gray-800 hover:bg-white"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

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
            <li>Explore carefully curated and regularly updated recipes.</li>
            <li>Find dishes based on ingredients you already have at home.</li>
            <li>Plan your weekly meals with just a few clicks.</li>
            <li>Automatically generate your shopping list from your chosen menu.</li>
          </ul>
        </div>

        {/* Bouton Connexion */}
        <button
          onClick={() => navigate("/login")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
        >
          {t("landing.loginButton")}
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-300 text-sm">
        © {new Date().getFullYear()} King Menu — {t("landing.footer")}
      </footer>
    </div>
  );
};

export default PublicLandingPage;
