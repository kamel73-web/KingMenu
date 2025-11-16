import React, { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';
import RecipeModal from "../Recipe/RecipeModal";

export default function FavoritesView() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedDish, setSelectedDish] = useState<any>(null); // Pour ouvrir RecipeModal

  // Charger l'utilisateur
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Charger les favoris
  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      setLoading(true);

      const { data: saved, error: savedError } = await supabase
        .from("saved_dishes")
        .select("dish_id")
        .eq("user_id", user.id);

      if (savedError) {
        console.error("Error loading favorites:", savedError);
        setLoading(false);
        return;
      }

      if (!saved || saved.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const dishIds = saved.map((f) => f.dish_id);

      const { data: dishes, error: dishesError } = await supabase
        .from("dishes")
        .select("*")
        .in("id", dishIds);

      if (dishesError) {
        console.error("Error loading dishes:", dishesError);
      } else {
        setFavorites(dishes || []);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  // Retirer un favori depuis la page
  const removeFavorite = async (dishId: number) => {
    if (!user) return;

    await supabase
      .from("saved_dishes")
      .delete()
      .eq("user_id", user.id)
      .eq("dish_id", dishId);

    setFavorites((prev) => prev.filter((f) => f.id !== dishId));
  };

  // Mapper un plat DB → format attendu par RecipeModal
  const formatForRecipeModal = (dish: any) => ({
    id: dish.id,
    title: dish.name?.fr || dish.name?.en || "Sans nom",
    image: dish.image_url,
    ingredients: dish.ingredients || [],
    instructions: dish.steps || [],
    difficulty: dish.difficulty,
    cookingTime: dish.cooking_time,
    servings: dish.servings,
  });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Aucun favori pour l’instant
          </h2>
          <p className="text-gray-600 font-body mb-6">
            Explore les plats et ajoute ceux que tu apprécies à tes favoris.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
          >
            Parcourir les plats
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-heading font-bold mb-6">Vos favoris ❤️</h2>

      {/* Grille des favoris */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((dish) => (
          <div
            key={dish.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all relative cursor-pointer"
            onClick={() => setSelectedDish(formatForRecipeModal(dish))}
          >
            {/* Bouton retirer favori */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // évite d’ouvrir le modal
                removeFavorite(dish.id);
              }}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            </button>

            <img
              src={dish.image_url || "/placeholder.jpg"}
              alt=""
              className="rounded-md w-full h-40 object-cover mb-3"
            />
            <h3 className="font-bold text-lg">
              {dish.name?.fr || dish.name?.en || "Sans nom"}
            </h3>
          </div>
        ))}
      </div>

      {/* Recipe Modal */}
      {selectedDish && (
        <RecipeModal
          dish={selectedDish}
          isOpen={true}
          onClose={() => setSelectedDish(null)}
          onEnterCookMode={() => {}}
        />
      )}
    </div>
  );
}
