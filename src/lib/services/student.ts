import { API_BASE_URL } from "$lib/utils/env.config";
import { fetchWrapper } from "$lib/utils/fetchWrapper";
import { handleResponse} from "$lib/utils/utils";


// Create class
export async function createStudent(data: any) {
    const res = await fetchWrapper(`${API_BASE_URL}/student`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return handleResponse(res, "Failed to create class");
}

// Update student
export async function updateStudent(id: string, data: any) {
    const res = await fetchWrapper(`${API_BASE_URL}/student/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
    return handleResponse(res, "Failed to update student");
}


// Fetch student list
export async function fetchStudentList(params: URLSearchParams) {
    let res = await fetchWrapper(`${API_BASE_URL}/student?${params.toString()}`, { method: "GET" });
	return handleResponse(res, "Failed to fetch student");
}

