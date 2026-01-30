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

  /* 🔑 REHYDRATATION SESSION SUPABASE */
  useEffect(() => {
    const loadSession = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        dispatch({
          type: "SET_USER",
          payload: {
            id: session.user.id,
            email: session.user.email || "",
            name:
              session.user.user_metadata?.full_name ||
              session.user.email ||
              "User",
          },
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadSession();

    /* 🔄 écoute les changements auth (Google, logout, refresh) */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch({
          type: "SET_USER",
          payload: {
            id: session.user.id,
            email: session.user.email || "",
            name:
              session.user.user_metadata?.full_name ||
              session.user.email ||
              "User",
          },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
