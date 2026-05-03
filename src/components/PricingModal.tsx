import React, { useState } from "react";
import { X, Check, Zap, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";

interface Props { open: boolean; onClose: () => void; }
type Period = "monthly" | "yearly";

const PLANS = [
  {
    id: "premium", name: "Premium", icon: Zap,
    monthlyEur: 1.99, yearlyEur: 15.99, color: "blue",
    features: [
      "Recettes illimitées", "Planning multi-semaines",
      "Recettes exclusives Premium", "Scan de frigo (bientôt)",
      "Profil nutritionnel", "Sync multi-appareils",
      "Export PDF · sans publicité",
    ],
  },
  {
    id: "family", name: "Famille", icon: Crown,
    monthlyEur: 3.99, yearlyEur: 31.99, color: "amber",
    features: [
      "Tout ce qu'inclut Premium", "6 profils indépendants",
      "Planning familial partagé", "Vote collectif sur les repas",
      "Intégration livraison courses", "Support prioritaire",
    ],
  },
];

export function PricingModal({ open, onClose }: Props) {
  const { state } = useApp();
  const [period, setPeriod] = useState<Period>("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubscribe = async (planId: string) => {
    setLoading(planId); setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan: planId, period },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally { setLoading(null); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
                      w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Passez à Premium</h2>
            <p className="text-sm text-gray-500 mt-1">Moins qu'un café — annulable à tout moment.</p>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 gap-1">
            {(["monthly", "yearly"] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500"}`}>
                {p === "monthly" ? "Mensuel" : "Annuel"}
                {p === "yearly" && (
                  <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">−33%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          {PLANS.map((plan) => {
            const price = period === "monthly" ? plan.monthlyEur : plan.yearlyEur;
            const Icon = plan.icon;
            const isBlue = plan.color === "blue";
            return (
              <div key={plan.id}
                className={`rounded-xl border-2 p-5 ${isBlue
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-amber-400 bg-amber-50 dark:bg-amber-950/30"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} className={isBlue ? "text-blue-600" : "text-amber-600"} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isBlue ? "text-blue-700" : "text-amber-700"}`}>{plan.name}</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">€{price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 ml-1">/{period === "monthly" ? "mois" : "an"}</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <Check size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleSubscribe(plan.id)} disabled={!!loading}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all
                    disabled:opacity-60 ${isBlue
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-amber-500 hover:bg-amber-600 text-white"}`}>
                  {loading === plan.id ? "Redirection…" : `Choisir ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
        {error && <p className="text-center text-sm text-red-600 pb-4">{error}</p>}
        <p className="text-center text-xs text-gray-400 pb-6">
          Paiement sécurisé · Annulation instantanée · Toutes langues incluses
        </p>
      </div>
    </div>
  );
}
