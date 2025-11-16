import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";

export default function AddToFavoritesButton({ dishId, size = 22 }) {
  const { favorites, toggleFavorite } = useFavorites();

  const isFav = favorites.includes(dishId);

  return (
    <button
      onClick={() => toggleFavorite(dishId)}
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
