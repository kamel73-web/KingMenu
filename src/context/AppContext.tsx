// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { supabase } from "../lib/supabase";

type User = { id: string; email: string; name: string };
type State = { user: User | null; isLoading: boolean };
const initialState: State = { user: null, isLoading: true };

type Action =
  | { type: "SET_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USER": return { ...state, user: action.payload, isLoading: false };
    case "LOGOUT": return { ...state, user: null, isLoading: false };
    case "SET_LOADING": return { ...state, isLoading: action.payload };
    default: return state;
  }
}

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    async function handleOAuthHash() {
      // Vérifie s'il y a un hash OAuth dans l'URL
      const hash = window.location.hash.substring(1);
      if (!hash.includes("access_token")) return;

      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
        window.location.hash = ""; // Nettoie le hash pour React Router
      }
    }

    async function hydrate() {
      try {
        await handleOAuthHash();

        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email || "Utilisateur",
          };
          dispatch({ type: "SET_USER", payload: userData });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (err) {
        console.error("Erreur hydratation OAuth :", err);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }

    hydrate();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || session.user.email || "Utilisateur",
        };
        dispatch({ type: "SET_USER", payload: userData });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    const safetyTimeout = setTimeout(() => {
      if (isMounted && state.isLoading) dispatch({ type: "SET_LOADING", payload: false });
    }, 5000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
