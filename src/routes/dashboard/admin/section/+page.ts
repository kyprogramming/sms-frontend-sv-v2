import { API_BASE_URL, DEFAULT_PAGE_LIMIT } from "$lib/constants/env.config";
import { error, redirect } from "@sveltejs/kit";
import type { PageLoad } from "../../../home/$types";

export const load: PageLoad = async ({ fetch }) => {
	const params = new URLSearchParams({ search: "", page: "1", limit: DEFAULT_PAGE_LIMIT });

	const res = await fetch(`${API_BASE_URL}/api/section?${params.toString()}`, {
		method: "GET",
		credentials: "include",
	});
	debugger;
	console.log("Server response:", res);
	if (!res.ok) {
		if (res.status === 401) {
			// Redirect logic or show unauthorized error
			throw redirect(302, "/login");
		} else {
			// Generic server error
			const message = await res.text();
			throw error(res.status, message || "Failed to fetch data from server");
		}
	}
	const data = await res.json();
	console.log("Data from Server:", data);
	return { data };
};
