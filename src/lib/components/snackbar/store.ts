// src/lib/components/snackbar/store.ts
import { writable } from "svelte/store";
import type { Snackbar } from "./types";

export const snackbars = writable<Snackbar[]>([]);

export function showSnackbar(snackbar: Omit<Snackbar, "id">) {
	// Set default type as 'success' if not provided
	const id = crypto.randomUUID();
	const type = snackbar.type || "success"; // Default to 'success'

	// Add the snackbar to the store
	snackbars.update((all) => [...all, { id, ...snackbar, type }]);

	// Remove the snackbar after the duration (default 4000ms)
	setTimeout(() => {
		snackbars.update((all) => all.filter((s) => s.id !== id));
	}, snackbar.duration || 4000);
}
