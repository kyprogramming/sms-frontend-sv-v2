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
        body: JSON.stringify(data),
    });
    return handleResponse(res, "Failed to create class");
}

// Fetch student list
export async function fetchStudentList(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/student?${params.toString()}`, { method: "GET" });
    // console.log("res:", res);
	return handleResponse(res, "Failed to fetch student");
}

