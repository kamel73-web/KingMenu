// pages/favorites.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useFavorites } from "@/hooks/useFavorites";
import DishCard from "@/components/Dishes/DishCard";

export default function FavoritesPage() {
  const { favorites, loading: favLoading, user } = useFavorites();
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les plats favoris
  useEffect(() => {
    if (!user || favLoading) return;

    const loadFavoriteDishes = async () => {
      try {
        setLoading(true);

        if (favorites.length === 0) {
          setFavoriteDishes([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("dishes")
          .select("*")
          .in("id", favorites);

        if (error) {
          console.error("Erreur chargement plats favoris:", error);
        } else {
          setFavoriteDishes(data);
        }
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteDishes();
  }, [favorites, favLoading, user]);

  if (!user)
    return (
      <div className="p-6 text-center text-gray-500">
        Veuillez vous connecter pour voir vos favoris.
      </div>
    );

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Chargement des favoris...
      </div>
    );

  if (favoriteDishes.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">
        Vous n'avez encore ajouté aucun plat en favori.
      </div>
    );

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteDishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
