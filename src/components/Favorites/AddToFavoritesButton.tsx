import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";

export default function AddToFavoritesButton({ dishId, size = 22 }) {
  const { favorites, toggleFavorite } = useFavorites();

  // Normalise l’ID (évite le bug string vs number)
  const numericId = Number(dishId);

  const isFav = favorites.includes(numericId);

  return (
    <button
      onClick={() => toggleFavorite(numericId)}
      className="p-1 transition"
      aria-label="Add to favorites"
    >
      <Heart
        size={size}
        className={isFav ? "text-red-500 fill-red-500" : "text-gray-400"}
      />
    </button>
  );
}
