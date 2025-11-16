import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';

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
        setFavorites(data.map((f) => f.dish_id));
      }

      setLoading(false);
    };

    loadFavorites();
  }, [user]);

  // Ajouter/supprimer
  const toggleFavorite = async (dishId: number) => {
    if (!user) return;

    const isFavorite = favorites.includes(dishId);

    if (isFavorite) {
      await supabase
        .from("saved_dishes")
        .delete()
        .eq("user_id", user.id)
        .eq("dish_id", dishId);

      setFavorites((prev) => prev.filter((id) => id !== dishId));
    } else {
      await supabase.from("saved_dishes").insert({
        user_id: user.id,
        dish_id: dishId,
      });

      setFavorites((prev) => [...prev, dishId]);
    }
  };

  return { favorites, toggleFavorite, loading, user };
}
