import { Heart } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";
import { useApp } from "../../context/AppContext";

interface AddToFavoritesButtonProps {
  dishId: string | number;
  size?: number;
}

export default function AddToFavoritesButton({ dishId, size = 22 }: AddToFavoritesButtonProps) {
  const { state } = useApp();
  const userId = state.user?.id ?? "";
  const { favorites, toggleFavorite } = useFavorites(userId);

  const numericId = Number(dishId);
  const isFav = favorites.includes(numericId);

  if (!userId) return null;

  return (
    <button
      onClick={() => toggleFavorite(numericId)}
      className="p-1 transition"
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        size={size}
        className={isFav ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-400"}
      />
    </button>
  );
}
