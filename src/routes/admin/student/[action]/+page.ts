import { API_BASE_URL, DEFAULT_PAGE_LIMIT } from "$lib/constants/env.config";
import { error } from "@sveltejs/kit";
import { isLoading } from "$lib/stores/loading";
import type { PageLoad } from "./$types";
import { invalidateAll } from "$app/navigation";
import { apiRequest } from "$lib/utils/api";

export const load: PageLoad = async ({ url }) => {
	// try {
	// 	isLoading.set(true);
	// 	const res = await fetch(`${API_BASE_URL}/class/list`, { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include" });
	// 	if (!res.ok) {
	// 		const message = await res.text(); // Generic server error
	// 		throw error(res.status, message || "Failed to fetch data from server");
	// 	}
	// 	const data = await res.json(); // console.log("Data from Server:", data);
	// 	return { data };
	// } catch (error) {
	// 	throw error; // Will be caught by +error.svelte
	// } finally {
	// 	isLoading.set(false);
	// }
    // console.log("url:", url);
    const id = url.searchParams.get("id");
    // const action = url.searchParams.get("action");
    // console.log("ID from URL:", id );

	try {
        if (!id) return { studentData: null };

        isLoading.set(true);
        const studentData = await apiRequest<any>(`${API_BASE_URL}/student/${id}`, "GET");
        // const res = await fetchApi(`${API_BASE_URL}/student/${id}`, { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include" });
		// if (!res.ok)  return { studentData: null };
        // const studentData = await res.json();
        // console.log("Student Data from Server:", studentData);
		return { studentData };
	} catch (error) {
		throw error;
	} finally {
		isLoading.set(false);
	}
};
