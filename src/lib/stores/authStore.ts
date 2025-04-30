// src/lib/stores/authStore.ts
import { derived, writable } from "svelte/store";

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

function createAuthStore() {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  };

  // Only hydrate from localStorage if we're in the browser
  if (typeof window !== "undefined") {
    try {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        initialState.user = JSON.parse(storedAuth).user;
        initialState.token = JSON.parse(storedAuth).token;
        initialState.isAuthenticated = true;
      }
    } catch (e) {
      console.error("Failed to hydrate auth store from localStorage", e);
    }
  }

  const store = writable<AuthState>(initialState);
  const { subscribe, set, update } = store;

  return {
    subscribe,
    login: (token: string, user: User) => {
      const newState: AuthState = {
        token,
        user,
        isAuthenticated: true,
        loading: false,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", JSON.stringify(newState));
      }
      set(newState);
    },
    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
        
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    },
    setLoading: (loading: boolean) => {
      update((state) => ({ ...state, loading }));
    },
  };
}

export const authStore = createAuthStore();

// Derived stores
export const isAuthenticated = derived(
  authStore,
  ($auth) => $auth.isAuthenticated,
);
export const currentUser = derived(authStore, ($auth) => $auth.user);
export const currentToken = derived(authStore, ($auth) => $auth.token);
export const isLoading = derived(authStore, ($auth) => $auth.loading);
