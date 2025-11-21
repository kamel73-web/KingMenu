import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Charger session + écouter les changements
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      console.log("AUTH USER:", data.session?.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Charger favoris de l'utilisateur
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("saved_dishes")
        .select("dish_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setFavorites(data.map((x) => x.dish_id));
      }

      setLoading(false);
    };

    load();
  }, [user]);

  // Ajouter / supprimer un favori
  const toggleFavorite = async (dishId: number) => {
    if (!user) {
      console.log("❌ No user logged in! Cannot toggle favorite.");
      return;
    }

    const isFav = favorites.includes(dishId);

    if (isFav) {
      await supabase
        .from("saved_dishes")
        .delete()
        .eq("user_id", user.id)
        .eq("dish_id", dishId);

      setFavorites((prev) => prev.filter((id) => id !== dishId));
    } else {
      await supabase
        .from("saved_dishes")
        .upsert(
          { user_id: user.id, dish_id: dishId },
          { onConflict: "user_id,dish_id" }
        );

      setFavorites((prev) => [...prev, dishId]);
    }
  };

  return { favorites, toggleFavorite, loading, user };
}
