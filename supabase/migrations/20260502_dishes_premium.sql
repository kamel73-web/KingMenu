-- Ajoute le flag premium sur les plats
ALTER TABLE public.dishes
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;

-- Index pour filtrer rapidement les plats premium
CREATE INDEX IF NOT EXISTS dishes_is_premium_idx ON public.dishes(is_premium);

-- Commentaire de documentation
COMMENT ON COLUMN public.dishes.is_premium IS
  'true = plat visible dans la liste mais recette complète réservée aux abonnés Premium/Famille';
