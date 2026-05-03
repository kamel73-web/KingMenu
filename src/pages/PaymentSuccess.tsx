// src/pages/PaymentSuccess.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, CheckCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [checking, setChecking] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Vérifier le statut de l'abonnement (polling 5s max)
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/welcome"); return; }

      const { data } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data?.plan === "premium" && ["active", "trialing"].includes(data?.status)) {
        setIsPremium(true);
        setChecking(false);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, 2000);
      } else {
        setChecking(false);
      }
    };

    check();
  }, [navigate]);

  // Countdown avant redirection
  useEffect(() => {
    if (!checking) {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timer); navigate("/meal-plan"); }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [checking, navigate]);

  return (
    <div className="min-h-screen bg-background-page flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">

        {checking ? (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-content-title">
              Activation en cours…
            </h1>
            <p className="text-content-muted text-sm">
              Nous vérifions votre paiement, cela prend quelques secondes.
            </p>
          </>
        ) : isPremium ? (
          <>
            {/* Succès */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
                <Crown className="h-10 w-10 text-amber-500" />
              </div>
            </div>
            <div className="flex justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-content-title">
              Bienvenue dans KingMenu Premium ! 👑
            </h1>
            <p className="text-content-muted">
              Votre abonnement est actif. Vous avez maintenant accès à toutes les recettes exclusives.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              Redirection automatique dans <strong>{countdown}s</strong>…
            </div>
            <button
              onClick={() => navigate("/meal-plan")}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Découvrir les recettes Premium
            </button>
          </>
        ) : (
          <>
            {/* Paiement reçu mais abonnement pas encore actif */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-content-title">
              Paiement reçu !
            </h1>
            <p className="text-content-muted text-sm">
              Votre abonnement sera activé dans quelques minutes. Rafraîchissez l'application si les recettes Premium ne sont pas encore disponibles.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
              Redirection dans <strong>{countdown}s</strong>…
            </div>
            <button
              onClick={() => navigate("/meal-plan")}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all"
            >
              Retour à l'application
            </button>
          </>
        )}

        <p className="text-xs text-content-muted">
          Des questions ? <a href="mailto:kingmenu.app@gmail.com" className="text-primary-500 hover:underline">kingmenu.app@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
