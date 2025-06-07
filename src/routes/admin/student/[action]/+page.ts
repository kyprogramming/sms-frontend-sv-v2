import { API_BASE_URL, DEFAULT_PAGE_LIMIT } from "$lib/utils/env.config";
import { isLoading } from "$lib/stores/loading";
import type { PageLoad } from "./$types";
import { apiRequest } from "$lib/utils/api";

export const load: PageLoad = async ({ url }) => {
	const id = url.searchParams.get("id");

	try {
		if (!id) return { studentData: null };
		isLoading.set(true);
		const studentData = await apiRequest<any>(`${API_BASE_URL}/student/${id}`, "GET");
		return { studentData };
	} catch (error) {
		throw error;
	} finally {
		isLoading.set(false);
	}
};
