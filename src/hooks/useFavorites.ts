// src/hooks/useFavorites.ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// CORRIGÉ : les IDs sont normalisés en number uniquement côté BDD,
// mais exposés en string côté React (cohérence avec Dish.id: string).

export const useFavorites = (userId: string) => {
  // Stockage interne en number pour correspondre aux FK Supabase
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // CORRIGÉ : useCallback pour éviter la recréation à chaque render
  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('saved_dishes')
      .select('dish_id')
      .eq('user_id', userId);

    if (!error && data) {
      setFavorites(data.map((item) => Number(item.dish_id)));
    } else if (error) {
      console.error('loadFavorites error:', error);
    }

    setLoading(false);
  }, [userId]); // CORRIGÉ : userId dans les dépendances

  // Ajouter un favori — accepte string ou number
  const addFavorite = useCallback(
    async (dishId: string | number) => {
      const numId = Number(dishId);
      if (isNaN(numId)) return;

      // Optimistic update
      setFavorites((prev) => (prev.includes(numId) ? prev : [...prev, numId]));

      const { error } = await supabase
        .from('saved_dishes')
        .insert([{ user_id: userId, dish_id: numId }])
        .select();

      // 23505 = violation contrainte unique (déjà favori) → on ignore
      if (error && error.code !== '23505') {
        console.error('addFavorite error:', error);
        // Rollback optimistic update
        setFavorites((prev) => prev.filter((id) => id !== numId));
      }
    },
    [userId]
  );

  // Retirer un favori — accepte string ou number
  const removeFavorite = useCallback(
    async (dishId: string | number) => {
      const numId = Number(dishId);
      if (isNaN(numId)) return;

      // Optimistic update
      setFavorites((prev) => prev.filter((id) => id !== numId));

      const { error } = await supabase
        .from('saved_dishes')
        .delete()
        .match({ user_id: userId, dish_id: numId });

      if (error) {
        console.error('removeFavorite error:', error);
        // Rollback optimistic update
        setFavorites((prev) => [...prev, numId]);
      }
    },
    [userId]
  );

  // Toggle — accepte string ou number (cohérence avec Dish.id: string)
  const toggleFavorite = useCallback(
    async (dishId: string | number) => {
      const numId = Number(dishId);
      if (favorites.includes(numId)) {
        await removeFavorite(numId);
      } else {
        await addFavorite(numId);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  // Helper : vérifier si un plat est favori (accepte string ou number)
  const isFavorite = useCallback(
    (dishId: string | number) => favorites.includes(Number(dishId)),
    [favorites]
  );

  useEffect(() => {
    if (userId) loadFavorites();
  }, [userId, loadFavorites]); // CORRIGÉ : loadFavorites stable grâce à useCallback

  return {
    favorites,          // number[] (IDs bruts)
    isFavorite,         // (string|number) => boolean — helper pratique
    toggleFavorite,     // (string|number) => Promise<void>
    loading,
    addFavorite,
    removeFavorite,
    refetch: loadFavorites,
  };
};
