// src/lib/api.ts

import { isAuthenticated, type User } from "$lib/stores/authStore";

type ApiResponse<T = null> = {
  success: boolean;
  message?: string;
  data?: T; // Make data generic
  error?: string;
  code?: number;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: any;
}
//localhost:5000/api/auth/login
const API_BASE = "http://localhost:5000/api"; // replace with env var in production

export async function login(
  credentials: LoginCredentials,
): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return await res.json();
}

// Logout Function
export const logout = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Remove token cookie
  //   isAuthenticated.set(false);
  //   user.set(null);
};
