// src/pages/DishPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, Heart, Crown, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { PricingModal } from "@/components/PricingModal";

export default function DishPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const lang = i18n.language || "fr";
  const [dish, setDish] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPricing, setShowPricing] = useState(false);

  const { isPremium } = useSubscription();

  // Fetch user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Fetch dish
  useEffect(() => {
    async function fetchDish() {
      setLoading(true);

      const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error loading dish:", error);
      } else {
        setDish(data);
      }

      setLoading(false);
    }

    fetchDish();
  }, [id]);

  // Check if favorite
  useEffect(() => {
    if (!user) return;
    if (!id) return;

    async function checkFavorite() {
      const { data } = await supabase
        .from("saved_dishes")
        .select("*")
        .eq("user_id", user.id)
        .eq("dish_id", id)
        .maybeSingle();

      setIsFavorite(!!data);
    }

    checkFavorite();
  }, [user, id]);

  // Toggle favorite
  async function toggleFavorite(e: any) {
    e.stopPropagation();

    if (!user) {
      toast.error(t("favorites.loginRequired", "Connectez-vous pour ajouter aux favoris."));
      return;
    }

    if (isFavorite) {
      await supabase
        .from("saved_dishes")
        .delete()
        .eq("user_id", user.id)
        .eq("dish_id", id);
      setIsFavorite(false);
    } else {
      await supabase.from("saved_dishes").insert({
        user_id: user.id,
        dish_id: Number(id),
      });
      setIsFavorite(true);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!dish) {
    return <div className="p-6 text-center">{t("dish.notFound", "Plat introuvable.")}</div>;
  }

  const isLocked = dish.is_premium && !isPremium;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft />
        {t("common.back", "Retour")}
      </button>

      {/* Image */}
      <div className="relative">
        <img
          src={dish.image_url}
          className={`w-full rounded-xl shadow-md object-cover max-h-96 ${isLocked ? 'blur-sm' : ''}`}
        />

        {/* Badge Premium sur l'image */}
        {dish.is_premium && (
          <span className="absolute top-4 left-4 flex items-center gap-1 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow">
            <Crown className="h-3 w-3" />
            Premium
          </span>
        )}

        {/* Favorite button */}
        {!isLocked && (
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
          >
            <Heart className={isFavorite ? "text-red-600 fill-red-600" : "text-gray-400"} />
          </button>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold">
        {dish.name?.[lang] || dish.name?.en || dish.name?.fr}
      </h1>

      {/* Metadata */}
      <div className="flex gap-4 text-gray-600">
        {dish.cooking_time && <span>🕒 {dish.cooking_time} min</span>}
        {dish.calories && <span>🔥 {dish.calories} kcal</span>}
      </div>

      {/* ── PREMIUM GATE ─────────────────────────────────────── */}
      {isLocked ? (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-amber-500 rounded-full p-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {t("premium.lockedRecipe", "Recette Premium")}
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {t("premium.lockedRecipeDesc", "Cette recette est réservée aux abonnés Premium. Débloquez-la ainsi que toutes les recettes exclusives.")}
          </p>
          <button
            onClick={() => setShowPricing(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all"
          >
            <Crown className="h-4 w-4" />
            {t("premium.unlockFor", "Débloquer pour €1,99/mois")}
          </button>
        </div>
      ) : (
        <>
          {/* Description */}
          {dish.description && (
            <p className="text-gray-700 leading-relaxed">
              {dish.description?.[lang] || dish.description?.en || dish.description?.fr}
            </p>
          )}

          {/* Steps */}
          {dish.steps && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold mt-4">{t("dish.steps", "Étapes")}</h2>
              {(dish.steps?.[lang] || dish.steps?.en || dish.steps?.fr || []).map((s: string, i: number) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  {i + 1}. {s}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* ─────────────────────────────────────────────────────── */}

      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
