import { API_BASE_URL } from "$lib/constants/env.config";
import { fetchWrapper } from "$lib/utils/fetchWrapper";
import { handleResponse, JSON_HEADERS } from "$lib/utils/utils";

// Create class
export async function createStudent(data: any) {
    console.log(data);
    const res = await fetchWrapper(`${API_BASE_URL}/student`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
        credentials: "include",
    });
    return handleResponse(res, "Failed to create class");
}
