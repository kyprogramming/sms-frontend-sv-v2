import { showSnackbar } from "$lib/components/snackbar/store";
import { isLoading } from "$lib/stores/loading";

export interface FetchOptions extends RequestInit {
	showError?: boolean; // Optional flag to control error logging/snackbar
}

export async function fetchWrapper<T = any>(url: string, options: FetchOptions = {}) {
	isLoading.set(true);

	try {
		const res = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...(options.headers || {}),
			},
			credentials: "include",
		});

		isLoading.set(false);
		console.log("RESPONSE:", res);
		
		if (!res.ok) {
			let errorMessage = `HTTP error! Status: ${res.status}`;
			try {
				const errorData = await res.json();
				errorMessage = errorData.message || errorMessage;
			} catch (e) {
				// No JSON body
			}
			throw new Error(errorMessage);
		}
		return await res.json();
		// if (data.success && data.message) showSnackbar({ message: data.message, type: "success" });
		// return data;
	} catch (err: any) {
		// isLoading.set(false);
		console.error("Fetch error:", err);
		if (options.showError !== false) showSnackbar({ message: err?.message || "Unexpected error", type: "error" });
		throw err instanceof Error ? err : new Error("Unexpected fetch error");
	} finally {
		isLoading.set(false);
	}
}
