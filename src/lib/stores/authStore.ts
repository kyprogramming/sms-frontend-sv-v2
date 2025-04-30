// src/lib/stores/authStore.ts
import { writable, derived } from "svelte/store";

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

const browser = typeof window !== "undefined";

export function createAuthStore() {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: browser,
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
      else {
           localStorage.setItem("auth", JSON.stringify(initialState));
        }
    } catch (e) {
      console.error("Failed to hydrate auth store from localStorage", e);
    }
  }
  const store = writable<AuthState>(initialState);
  const { subscribe, set, update } = store;

  // Hydrate from storage in browser
  if (browser) {
    const hydrate = () => {
      try {
        const stored = localStorage.getItem("auth");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.token) {
            set({
              user: parsed.user,
              token: parsed.token,
              isAuthenticated: true,
              loading: false,
            });
            return;
          }
        }
      } catch (err) {
        console.error("Auth hydration error:", err);
      }
      update((s) => ({ ...s, loading: false }));
    };

    // Hydrate immediately
    hydrate();

    // Optional: listen for storage events from other tabs
    window.addEventListener("storage", (event) => {
      if (event.key === "auth") {
        hydrate();
      }
    });
  }

  return {
    subscribe,

    login: (token: string, user: User) => {
      const newState: AuthState = {
        user,
        token,
        isAuthenticated: true,
        loading: false,
      };

      if (browser) {
        alert();
        localStorage.setItem("auth", JSON.stringify(newState));
        document.cookie = `token=${token}; path=/; SameSite=Lax; Secure${location.protocol === "https:" ? "; Secure" : ""}`;
      }

      set(newState);
    },

    logout: () => {
      if (browser) {
        // alert(localStorage.getItem("auth"));
        localStorage.removeItem("auth");
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
   document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
export const isAuthenticated = derived(authStore,($auth) => $auth.isAuthenticated);
export const currentUser = derived(authStore, ($auth) => $auth.user);
export const currentToken = derived(authStore, ($auth) => $auth.token);
export const isLoading = derived(authStore, ($auth) => $auth.loading);
