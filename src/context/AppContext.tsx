// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { supabase } from "../lib/supabase";

type User = { id: string; email: string; name: string };

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
      return { user: action.payload, isLoading: false };
    case "LOGOUT":
      return { user: null, isLoading: false };
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

    const initAuth = async () => {
      try {
        console.log("🔥 [AppContext] Initialisation auth...");

        // ✅ TRAITEMENT OAUTH (Google)
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true,
        });

        if (error) {
          console.error("❌ Erreur getSessionFromUrl:", error);
        }

        if (data?.session) {
          console.log("✅ Session récupérée depuis URL OAuth");
        }

        // ✅ Hydratation normale
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

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
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (err) {
        console.error("❌ Erreur hydratation OAuth:", err);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();

    // 🔥 Listener Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔥 AUTH EVENT:", event);

      if (!isMounted) return;

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
    });

    // 🛟 Sécurité anti-blocage loading
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, 5000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
