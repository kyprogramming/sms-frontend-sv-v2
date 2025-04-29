import { writable } from "svelte/store";

export const authStore = writable<{ user: any; role: string | null }>({ user: null, role: null });
