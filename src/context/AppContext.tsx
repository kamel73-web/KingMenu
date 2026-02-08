// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  email: string;
  name: string;
};

type State = {
  user: User | null;
  isLoading: boolean;
};

const initialState: State = {
  user: null,
  isLoading: true,
};

type Action =
  | { type: "SET_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, isLoading: false };
    case "LOGOUT":
      return { ...state, user: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    console.log("🔥 [AppContext] Démarrage du contexte d'authentification");

    // 1. Listener principal en temps réel (SIGNED_IN, SIGNED_OUT, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        console.log(
          `🔥 [AppContext] Événement AUTH reçu : ${event} à ${new Date().toLocaleTimeString()}`
        );
        console.log(
          "   → session présente ?",
          !!session,
          session?.user ? ` (ID: ${session.user.id})` : ""
        );

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            name:
              session.user.user_metadata?.full_name ||
              session.user.email ||
              "Utilisateur",
          };
          dispatch({ type: "SET_USER", payload: userData });
          // Petit délai pour laisser React Router respirer
          setTimeout(() => {
            console.log("   → SET_USER dispatché");
          }, 0);
        } else {
          dispatch({ type: "LOGOUT" });
        }
      }
    );

    // 2. Hydratation initiale + gestion race condition OAuth
    const hydrateSession = async () => {
      try {
        console.log("🔥 [AppContext] Hydratation initiale via getSession()");
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (isMounted) {
          if (session?.user) {
            console.log("🔥 [AppContext] Session valide trouvée au chargement");
            const userData: User = {
              id: session.user.id,
              email: session.user.email || "",
              name:
                session.user.user_metadata?.full_name ||
                session.user.email ||
                "Utilisateur",
            };
            dispatch({ type: "SET_USER", payload: userData });
          } else {
            // Cas critique : hash OAuth présent mais session non détectée
            if (window.location.hash.includes("access_token")) {
              console.log(
                "🔥 [AppContext] Hash OAuth détecté mais pas de session → FORCED RELOAD"
              );
              window.location.reload();
              return;
            }

            console.log("🔥 [AppContext] Aucune session au démarrage");
            dispatch({ type: "SET_LOADING", payload: false });
          }
        }
      } catch (err) {
        console.error("❌ [AppContext] Erreur hydratation :", err);
        if (isMounted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    hydrateSession();

    // 3. Sécurité : timeout max 5s pour éviter blocage loading
    const safetyTimeout = setTimeout(() => {
      if (isMounted && state.isLoading) {
        console.warn("⚠️ [AppContext] Timeout loading (5s) → forçage false");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, 5000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
      console.log("🧹 [AppContext] Nettoyage terminé");
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
