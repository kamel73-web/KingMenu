import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { mapSupabaseDishToModel } from "@/lib/dishMapper";
import { useFavorites } from "@/hooks/useFavorites";
import { useApp } from "@/context/AppContext";
import DishCard from "@/components/Home/DishCard";
import { Dish } from "@/types";

export default function FavoritesView() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();
  const lang = i18n.language.split("-")[0] || "fr";

  const { state } = useApp();
  const userId = state.user?.id ?? "";
  const { favorites, toggleFavorite } = useFavorites(userId);

  useEffect(() => {
    if (!userId) return;

    const fetchFavorites = async () => {
      setLoading(true);

      const { data: saved, error: savedError } = await supabase
        .from("saved_dishes")
        .select("dish_id")
        .eq("user_id", userId);

      if (savedError) {
        console.error("Error loading favorites:", savedError);
        setLoading(false);
        return;
      }

      if (!saved || saved.length === 0) {
        setDishes([]);
        setLoading(false);
        return;
      }

      const dishIds = saved.map((f: any) => f.dish_id);

      const { data: rawDishes, error: dishesError } = await supabase
        .from("dishes")
        .select(`
          *,
          dish_ingredients (
            quantity, unit,
            ingredient:ingredient_id ( id, name, category )
          )
        `)
        .in("id", dishIds);

      if (dishesError) {
        console.error("Error loading dishes:", dishesError);
        setLoading(false);
        return;
      }

      const mapped: Dish[] = (rawDishes || []).map((row: any) =>
        mapSupabaseDishToModel(row, lang)
      );

      setDishes(mapped);
      setLoading(false);
    };

    fetchFavorites();
  }, [userId, lang]);

  // Retirer du display local quand on retire un favori
  const handleToggleFavorite = async (dishId: string | number) => {
    const numId = Number(dishId);
    const wasAlreadyFav = favorites.includes(numId);
    await toggleFavorite(dishId);
    if (wasAlreadyFav) {
      setDishes((prev) => prev.filter((d) => Number(d.id) !== numId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
      </div>
    );
  }

  if (!dishes.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            {t("favorites.empty", "Aucun favori pour l'instant")}
          </h2>
          <p className="text-gray-600 font-body mb-6">
            {t("favorites.emptyDesc", "Explore les plats et ajoute ceux que tu appr\u00e9cies \u00e0 tes favoris.")}
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
          >
            {t("favorites.browse", "Parcourir les plats")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-heading font-bold mb-8">
        {t("favorites.title", "Vos favoris")} ❤️
        <span className="ml-3 text-lg font-normal text-gray-500">
          ({dishes.length})
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            favorites={favorites}
            toggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
