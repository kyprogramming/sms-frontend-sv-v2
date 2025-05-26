import { API_BASE_URL, DEFAULT_PAGE_LIMIT } from "$lib/constants/env.config";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "../../../home/$types";
import { isLoading } from "$lib/stores/loading";

export const load: PageLoad = async ({ fetch }) => {
	try {
		isLoading.set(true);
		const params = new URLSearchParams({ search: "", page: "1", limit: DEFAULT_PAGE_LIMIT });
		const res = await fetch(`${API_BASE_URL}/subject?${params.toString()}`, { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include" });

		if (!res.ok) {
			const message = await res.text(); // Generic server error
			throw error(res.status, message || "Failed to fetch data from server");
		}

		const data = await res.json(); // console.log("Data from Server:", data);
		return { data };
	} catch (error) {
		throw error; // Will be caught by +error.svelte
	} finally {
		isLoading.set(false);
	}
};
