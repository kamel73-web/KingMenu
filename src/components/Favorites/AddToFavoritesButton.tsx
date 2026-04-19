import { Heart } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useFavorites } from "../../hooks/useFavorites";

interface AddToFavoritesButtonProps {
  dishId: string | number;
  size?: number;
  favorites?: number[];
  toggleFavorite?: (id: number) => Promise<void>;
}

export default function AddToFavoritesButton({
  dishId,
  size = 22,
  favorites: externalFavorites,
  toggleFavorite: externalToggle,
}: AddToFavoritesButtonProps) {
  const { state } = useApp();
  const userId = state.user?.id ?? "";

  // Si favorites passés en props depuis DishGrid : 0 requête supplémentaire
  const { favorites: localFavorites, toggleFavorite: localToggle } = useFavorites(
    externalFavorites !== undefined ? "" : userId
  );

  const favorites = externalFavorites ?? localFavorites;
  const toggle = externalToggle ?? localToggle;
  const numericId = Number(dishId);
  const isFav = favorites.includes(numericId);

  if (!userId) return null;

  return (
    <button
      onClick={() => toggle(numericId)}
      className="p-1 transition"
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        size={size}
        className={isFav ? "text-red-500 fill-red-500" : "text-content-hint hover:text-red-400"}
      />
    </button>
  );
}
