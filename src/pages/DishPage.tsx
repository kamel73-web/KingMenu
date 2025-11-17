// src/pages/DishPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, Heart } from "lucide-react";

export default function DishPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dish, setDish] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

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
      alert("Connectez-vous pour ajouter aux favoris.");
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
    return <div className="p-6 text-center">Plat introuvable.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft />
        Retour
      </button>

      {/* Image */}
      <div className="relative">
        <img
          src={dish.image_url}
          className="w-full rounded-xl shadow-md object-cover max-h-96"
        />

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
        >
          <Heart className={isFavorite ? "text-red-600 fill-red-600" : "text-gray-400"} />
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold">
        {dish.name?.fr || dish.name?.en}
      </h1>

      {/* Metadata */}
      <div className="flex gap-4 text-gray-600">
        {dish.cooking_time && <span>🕒 {dish.cooking_time} min</span>}
        {dish.calories && <span>🔥 {dish.calories} kcal</span>}
      </div>

      {/* Description */}
      {dish.description && (
        <p className="text-gray-700 leading-relaxed">
          {dish.description?.fr || dish.description?.en}
        </p>
      )}

      {/* Steps */}
      {dish.steps && (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold mt-4">Étapes</h2>
          {dish.steps?.fr?.map((s: string, i: number) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              {i + 1}. {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

