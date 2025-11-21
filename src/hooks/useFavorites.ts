import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur connecté
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Charger les favoris de l'utilisateur
  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("saved_dishes")
        .select("dish_id")
        .eq("user_id", user.id);

      if (!error && data) {
        // FORCER LE TYPE → number
        const normalized = data.map((f) => Number(f.dish_id));
        setFavorites(normalized);
      }

      setLoading(false);
    };

    loadFavorites();
  }, [user]);

  // Ajouter/Supprimer un favori
  const toggleFavorite = async (dishId: number | string) => {
    if (!user) return;

    // Normaliser
    const numericId = Number(dishId);

    const isFavorite = favorites.includes(numericId);

    if (isFavorite) {
      await supabase
        .from("saved_dishes")
        .delete()
        .eq("user_id", user.id)
        .eq("dish_id", numericId);

      setFavorites((prev) => prev.filter((id) => id !== numericId));
    } else {
      await supabase
        .from("saved_dishes")
        .insert({
          user_id: user.id,
          dish_id: numericId,
        });

      setFavorites((prev) => [...prev, numericId]);
    }
  };

  return { favorites, toggleFavorite, loading, user };
}
