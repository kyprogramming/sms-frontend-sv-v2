import { API_BASE_URL } from "$lib/constants/env.config";
import { fetchWrapper } from "$lib/utils/fetchWrapper";
import { handleResponse, JSON_HEADERS } from "$lib/utils/utils";

export interface StudentPayload {
	name: string;
}

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

// Fetch student list
export async function fetchStudentList(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/student?${params.toString()}`, {
		method: "GET",
		headers: JSON_HEADERS,
		credentials: "include",
    });
    // console.log("res:", res);
	return handleResponse(res, "Failed to fetch student");
}

