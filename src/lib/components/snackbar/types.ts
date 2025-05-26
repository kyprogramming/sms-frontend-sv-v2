// src/lib/components/snackbar/types.ts
export type SnackbarType = "success" | "error" | "info" | "warning";

export interface Snackbar {
	id: string;
	message: string;
	type: SnackbarType;
	duration?: number; // in ms
}
