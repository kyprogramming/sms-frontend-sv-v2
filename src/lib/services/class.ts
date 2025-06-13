import { API_BASE_URL } from "$lib/utils/env.config";
import { fetchWrapper } from "$lib/utils/fetchWrapper";
import { handleResponse, JSON_HEADERS } from "$lib/utils/utils";

// Payload interface for create/update
export interface ClassPayload {
	name: string;
	sectionIds: string [];
}

// Create class
export async function createClass(data: ClassPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/class`, {
		method: "POST",
		body: JSON.stringify(data),
	});
	return handleResponse(res, "Failed to create class");
}

// Fetch multiple classes
export async function fetchClasses(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/class?${params.toString()}`, { method: "GET" });
	return handleResponse(res, "Failed to fetch classes");
}

// Fetch single class by ID
export async function fetchClassById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/class/${id}`, { method: "GET" });
	return handleResponse(res, "Failed to fetch class");
}

// Update class
export async function updateClass(id: string, data: any) {
	const res = await fetchWrapper(`${API_BASE_URL}/class/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
	return handleResponse(res, "Failed to update class");
}

// Delete class
export async function deleteClassById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/class/${id}`, { method: "DELETE" });
	return handleResponse(res, "Failed to delete class");
}
