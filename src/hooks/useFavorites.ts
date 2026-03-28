import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useFavorites = (userId: string) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger tous les favoris
  const loadFavorites = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("saved_dishes")
      .select("dish_id")
      .eq("user_id", userId);

    if (!error && data) {
      setFavorites(data.map((item) => item.dish_id));
    }

    setLoading(false);
  };

  // Ajouter un favori
  const addFavorite = async (dishId: number) => {
    const { error } = await supabase
      .from("saved_dishes")
      .insert([{ user_id: userId, dish_id: dishId }])
      .select();

    // ⚠️ erreur 409 = entrée déjà existante -> on ignore
    if (error && error.code !== "23505") {
      console.error("Insert error:", error);
      return;
    }

    setFavorites((prev) => [...prev, dishId]);
  };

  // Retirer un favori
  const removeFavorite = async (dishId: number) => {
    const { error } = await supabase
      .from("saved_dishes")
      .delete()
      .match({ user_id: userId, dish_id: dishId });

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    setFavorites((prev) => prev.filter((id) => id !== dishId));
  };

  // Toggle
  const toggleFavorite = async (dishId: number) => {
    if (favorites.includes(dishId)) {
      await removeFavorite(dishId);
    } else {
      await addFavorite(dishId);
    }
  };

  useEffect(() => {
    if (userId) loadFavorites();
  }, [userId]);

  return { favorites, toggleFavorite, loading, addFavorite, removeFavorite };
};
