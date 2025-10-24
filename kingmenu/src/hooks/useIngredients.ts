import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ingredient } from '@/types';

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        setError(error.message);
        setIngredients([]);
      } else {
        setIngredients(data || []);
      }
      setLoading(false);
    };

    fetchIngredients();
  }, []);

  return { ingredients, loading, error };
}
