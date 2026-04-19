import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    emoji: "🍲",
    titleKey: "landing.featureRecipes",
    descKey: "landing.featureRecipesDesc",
    fallbackTitle: "500+ Curated Recipes",
    fallbackDesc: "From weeknight dinners to weekend feasts — every dish, every cuisine.",
  },
  {
    emoji: "📅",
    titleKey: "landing.featurePlanner",
    descKey: "landing.featurePlannerDesc",
    fallbackTitle: "7-Day Meal Planning",
    fallbackDesc: "Drag, drop, done. Your entire week planned in under 2 minutes.",
  },
  {
    emoji: "🛒",
    titleKey: "landing.featureShoppingList",
    descKey: "landing.featureShoppingListDesc",
    fallbackTitle: "Smart Shopping List",
    fallbackDesc: "Auto-generated, ingredient-merged, ready to share.",
  },
  {
    emoji: "🥕",
    titleKey: "landing.featureIngredients",
    descKey: "landing.featureIngredientsDesc",
    fallbackTitle: "Cook What You Have",
    fallbackDesc: "Enter your fridge contents — we'll find matching recipes instantly.",
  },
];

const STATS = [
  { value: "500+", label: "Recipes" },
  { value: "5", label: "Languages" },
  { value: "7-day", label: "Meal Plans" },
  { value: "Free", label: "To Start" },
];

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "fr", flag: "🇫🇷", label: "FR" },
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "it", flag: "🇮🇹", label: "IT" },
  { code: "ar", flag: "🇩🇿", label: "AR" },
];

const PublicLandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPwaPrompt(e);
      setShowPwaBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallPwa = async () => {
    if (!pwaPrompt) return;
    pwaPrompt.prompt();
    const { outcome } = await pwaPrompt.userChoice;
    if (outcome === "accepted") setShowPwaBanner(false);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("gusto-language", lang);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-gray-950 text-white">

      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/Background%20v2.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-gray-950" />

      {/* PWA Install Banner */}
      {showPwaBanner && (
        <div className="relative z-20 bg-amber-500 text-gray-950 text-sm font-semibold flex items-center justify-between px-4 py-2">
          <span>📲 Add KingMenu to your home screen for the best experience</span>
          <div className="flex gap-2">
            <button
              onClick={handleInstallPwa}
              className="bg-gray-950 text-amber-400 px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="text-gray-700 hover:text-gray-950 text-lg leading-none px-1"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img
            src="https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/logo%20KM.jpg"
            alt="KingMenu"
            className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-amber-400"
          />
          <span className="font-bold text-xl tracking-tight text-white" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
            KingMenu
          </span>
        </div>
        <div className="flex gap-1.5">
          {LANGUAGES.map(({ code, flag, label }) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                i18n.language === code
                  ? "bg-amber-500 text-gray-950 shadow-md"
                  : "bg-white/10 text-gray-300 hover:bg-white/25"
              }`}
            >
              <span className="mr-0.5">{flag}</span> {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-8 pb-20">
        <div className="max-w-4xl w-full">

          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Free to use — No credit card required
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 drop-shadow-xl"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            Stop asking<br />
            <span className="text-amber-400">"What's for dinner?"</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            KingMenu plans your week, generates your shopping list, and finds recipes for whatever's in your fridge — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              onClick={() => navigate("/login")}
              className="group relative bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-lg px-10 py-4 rounded-2xl shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-amber-500/40 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Start Planning for Free
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-white/25 hover:border-white/50 text-gray-200 hover:text-white font-semibold text-base px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
            >
              Sign in
            </button>
          </div>

          <p className="text-gray-500 text-sm">
            Join thousands of home cooks who plan smarter, waste less, and eat better.
          </p>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-5 text-center">
                <div className="text-2xl font-black text-amber-400" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                  {value}
                </div>
                <div className="text-gray-400 text-xs font-semibold mt-1 uppercase tracking-wider">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 bg-gray-950 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-black text-center text-white mb-4"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            Everything you need to eat well.
          </h2>
          <p className="text-gray-400 text-center text-lg mb-14 max-w-xl mx-auto">
            One app — from inspiration to grocery checkout.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map(({ emoji, titleKey, descKey, fallbackTitle, fallbackDesc }) => {
              const title = t(titleKey, { defaultValue: fallbackTitle });
              const desc  = t(descKey,  { defaultValue: fallbackDesc });
              return (
                <div
                  key={titleKey}
                  className="flex items-start gap-4 bg-gray-900 border border-white/8 rounded-2xl p-6 hover:border-amber-500/30 hover:bg-gray-900/80 transition-all duration-200 group"
                >
                  <span className="text-3xl flex-shrink-0 mt-0.5">{emoji}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-amber-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 bg-amber-500 py-16 px-6 text-center">
        <h2
          className="text-3xl md:text-4xl font-black text-gray-950 mb-4"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          Your best meals are one plan away.
        </h2>
        <p className="text-gray-800 text-lg mb-8 max-w-lg mx-auto">
          Free forever. No credit card. Works offline on any device.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-gray-950 hover:bg-gray-800 text-amber-400 font-black text-lg px-10 py-4 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105"
        >
          Get Started — It's Free →
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-950 border-t border-white/8 text-gray-500 text-sm py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} KingMenu. {t("landing.footer", { defaultValue: "All rights reserved." })}</span>
          <div className="flex gap-6">
            <a href="/KingMenu/privacy-policy.html" className="hover:text-white transition-colors underline underline-offset-2">
              Privacy Policy
            </a>
            <a href="/KingMenu/terms-of-use.html" className="hover:text-white transition-colors underline underline-offset-2">
              Terms of Use
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
