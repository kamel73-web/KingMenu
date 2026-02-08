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

    console.log("[AppContext] Démarrage du contexte d'authentification");

    // Listener principal en temps réel
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        console.log(
          "[AppContext] Événement auth reçu :",
          event,
          "→ session :",
          session ? "présente" : "absente"
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
        } else {
          dispatch({ type: "LOGOUT" });
        }
      }
    );

    // Hydratation + correction race condition après OAuth redirect
    const hydrateSession = async () => {
      try {
        console.log("[AppContext] Hydratation initiale via getSession()");
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (isMounted) {
          if (session?.user) {
            console.log("[AppContext] Session valide trouvée au chargement");
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
                "[AppContext] Hash OAuth détecté mais session non chargée → FORCED RELOAD pour traiter le hash"
              );
              // Force le rechargement pour que detectSessionInUrl fasse son travail
              window.location.reload();
              return; // On sort pour ne pas continuer
            }

            console.log("[AppContext] Aucune session au démarrage");
            dispatch({ type: "SET_LOADING", payload: false });
          }
        }
      } catch (err) {
        console.error("[AppContext] Erreur lors de l'hydratation :", err);
        if (isMounted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    hydrateSession();

    // Sécurité anti-blocage : timeout max 5 secondes
    const safetyTimeout = setTimeout(() => {
      if (isMounted && state.isLoading) {
        console.warn(
          "[AppContext] Timeout de chargement dépassé (5s) → forçage fin du loading"
        );
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, 5000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
      console.log("[AppContext] Nettoyage du contexte effectué");
    };
  }, []); // ← C'EST ICI : le seul useEffect qui gère l'auth

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
