// src/pages/PricingPage.tsx
import { useState } from "react";
import { Crown, Check, Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";
import { useSubscription } from "@/hooks/useSubscription";

type Period = "monthly" | "yearly";

const FEATURES_FREE = [
  "Accès à 80+ recettes gratuites",
  "Planning de repas (7 jours)",
  "Liste de courses automatique",
  "5 recettes favorites",
];

const FEATURES_PREMIUM = [
  "Toutes les recettes (100+)",
  "Recettes exclusives Premium 👑",
  "Planning illimité multi-semaines",
  "Favoris illimités",
  "Scan de frigo (bientôt)",
  "Profil nutritionnel",
  "Sync multi-appareils",
  "Sans publicité",
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useApp();
  const { isPremium, plan } = useSubscription();
  const [period, setPeriod] = useState<Period>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthlyPrice = 1.99;
  const yearlyPrice = 15.99;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);

  const handleSubscribe = async () => {
    if (!state.user) { navigate("/login"); return; }
    setLoading(true); setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan: "premium", period },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-page pb-24">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 shadow-soft sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-content-muted hover:bg-neutral-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-content-title">Plans & Tarifs</h1>
            <p className="text-xs text-content-muted">Choisissez le plan qui vous convient</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Badge statut actuel */}
        {isPremium && (
          <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <Crown className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">
              Vous êtes déjà abonné Premium 👑
            </span>
          </div>
        )}

        {/* Toggle mensuel/annuel */}
        <div className="flex justify-center">
          <div className="flex bg-neutral-100 rounded-full p-1 gap-1">
            {(["monthly", "yearly"] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  period === p
                    ? "bg-white text-content-title shadow-soft"
                    : "text-content-muted hover:text-content-body"
                }`}>
                {p === "monthly" ? "Mensuel" : "Annuel"}
                {p === "yearly" && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                    −33%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Plan Gratuit */}
          <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-neutral-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-500">Gratuit</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-content-title">€0</span>
                <span className="text-content-muted text-sm">/toujours</span>
              </div>
              <p className="text-xs text-content-muted mt-1">Pour découvrir KingMenu</p>
            </div>
            <ul className="space-y-2">
              {FEATURES_FREE.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-content-body">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl border-2 border-neutral-200 text-content-body text-sm font-semibold hover:bg-neutral-50 transition-all">
              Continuer gratuitement
            </button>
          </div>

          {/* Plan Premium */}
          <div className="bg-white rounded-2xl border-2 border-amber-400 p-6 space-y-5 relative shadow-medium">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                ⭐ Recommandé
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-bold uppercase tracking-wider text-amber-600">Premium</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-content-title">
                  €{period === "monthly" ? monthlyPrice : yearlyMonthly}
                </span>
                <span className="text-content-muted text-sm">/mois</span>
              </div>
              {period === "yearly" && (
                <p className="text-xs text-amber-600 font-medium mt-1">
                  €{yearlyPrice}/an · 2 mois offerts
                </p>
              )}
              {period === "monthly" && (
                <p className="text-xs text-content-muted mt-1">Moins d'un café par mois</p>
              )}
            </div>
            <ul className="space-y-2">
              {FEATURES_PREMIUM.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-content-body">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {isPremium ? (
              <div className="w-full py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold text-center">
                ✅ Plan actif
              </div>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? "Redirection…" : (
                  <>
                    <Crown className="h-4 w-4" />
                    {period === "monthly" ? "Essayer 7 jours gratuits" : "S'abonner annuellement"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        {/* Garanties */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "🔒", text: "Paiement sécurisé" },
            { icon: "↩️", text: "Annulation instantanée" },
            { icon: "🌍", text: "Toutes langues incluses" },
          ].map(({ icon, text }) => (
            <div key={text} className="bg-white rounded-xl border border-neutral-100 p-3">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xs text-content-muted font-medium">{text}</p>
            </div>
          ))}
        </div>

        {/* FAQ rapide */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
          <h2 className="font-bold text-content-title">Questions fréquentes</h2>
          {[
            {
              q: "Puis-je annuler à tout moment ?",
              a: "Oui, annulation en un clic depuis votre espace client. Accès maintenu jusqu'à la fin de la période."
            },
            {
              q: "Comment fonctionne l'essai gratuit ?",
              a: "7 jours gratuits sans engagement. Aucun débit avant la fin de la période d'essai."
            },
            {
              q: "Quelle différence entre mensuel et annuel ?",
              a: "L'abonnement annuel revient à €1,33/mois au lieu de €1,99 — vous économisez 33%."
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-content-title mb-1">{q}</p>
              <p className="text-sm text-content-muted">{a}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
