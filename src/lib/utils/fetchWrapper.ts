import { showSnackbar } from "$lib/components/snackbar/store";
import { isLoading } from "$lib/stores/loading";

export interface FetchOptions extends RequestInit {
	showError?: boolean;
}

export async function fetchWrapper<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
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

		if (!res.ok) {
			let errorMessage = `HTTP error! Status: ${res.status}`;
			try {
				const errorData = await res.json();
				errorMessage = errorData.message || errorMessage;
			} catch {
				// response was not JSON
			}
			throw new Error(errorMessage);
		}

		const data = await res.json();
		return data as T;
	} catch (err: any) {
		console.error("Fetch error:", err);

		if (options.showError !== false) {
			showSnackbar({
				message: "Failed to perform the request. Please try again.",
				type: "error",
			});
		}

		throw err instanceof Error ? err : new Error("Unexpected fetch error");
	} finally {
		isLoading.set(false);
	}
}
