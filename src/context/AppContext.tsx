// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { supabase } from "../lib/supabase";

export type User = {
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

// Définition TS stricte pour le context
type AppContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    // 1️⃣ Listener Supabase AUTH
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
      }
    );

    // 2️⃣ Hydratation initiale
    const hydrateSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

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
        console.error("❌ [AppContext] Hydratation erreur :", err);
        if (isMounted) dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    hydrateSession();

    // 3️⃣ Timeout sécurité pour éviter blocage
    const safetyTimeout = setTimeout(() => {
      if (isMounted && state.isLoading) {
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

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
