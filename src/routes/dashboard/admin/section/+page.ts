import { API_BASE_URL, DEFAULT_PAGE_LIMIT } from "$lib/constants/env.config";
import { error, redirect } from "@sveltejs/kit";
import type { PageLoad } from "../../../home/$types";

export const load: PageLoad = async ({ fetch }) => {
	const params = new URLSearchParams({ search: "", page: "1", limit: DEFAULT_PAGE_LIMIT });

	const res = await fetch(`${API_BASE_URL}/section?${params.toString()}`, {
		method: "GET",
		credentials: "include",
	});
	if (!res.ok) {
		if (res.status === 401) {
			throw redirect(302, "/login"); // Redirect logic or show unauthorized error
		} else {
			const message = await res.text(); // Generic server error
			throw error(res.status, message || "Failed to fetch data from server");
		}
	}
	const data = await res.json();
	// console.log("Data from Server:", data);
	return { data };
};
