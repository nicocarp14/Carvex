import { create } from "zustand";
import type { AdminUser } from "../types";

const TOKEN_KEY = "carvex-admin-token";
const USER_KEY = "carvex-admin-user";

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  setSession: (token: string, user: AdminUser) => void;
  logout: () => void;
}

const loadUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
};

const loadToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const useAuth = create<AuthState>((set) => ({
  token: loadToken(),
  user: loadUser(),
  setSession: (token, user) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      /* noop */
    }
    set({ token, user });
  },
  logout: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      /* noop */
    }
    set({ token: null, user: null });
  },
}));
