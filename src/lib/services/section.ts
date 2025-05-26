import { API_BASE_URL } from "$lib/constants/env.config";
import { fetchWrapper } from "$lib/utils/fetchWrapper";
import { handleResponse, JSON_HEADERS } from "$lib/utils/utils";

// Section interface
export interface ISection {
	id: string;
	name: string;
}

// Payload interface for create/update
export interface SectionPayload {
	name: string;
}

// Create section
export async function createSection(data: SectionPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/section`, {
		method: "POST",
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
		credentials: "include",
	});
	return handleResponse(res, "Failed to create section");
}

// Fetch all sections list
export async function fetchSectionList() {
	const res = await fetchWrapper(`${API_BASE_URL}/section/list`, {
		method: "GET",
		headers: JSON_HEADERS,
		credentials: "include",
	});
	return handleResponse(res, "Failed to fetch sections");
}

// Fetch multiple sections
export async function fetchSections(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/section?${params.toString()}`, {
		method: "GET",
		headers: JSON_HEADERS,
		credentials: "include",
	});
	return handleResponse(res, "Failed to fetch sections");
}


// Fetch single section by ID
export async function fetchSectionById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/section/${id}`, {
		method: "GET",
		headers: JSON_HEADERS,
		credentials: "include",
	});
	return handleResponse(res, "Failed to fetch section");
}

// Update section
export async function updateSection(id: string, data: SectionPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/section/${id}`, {
		method: "PUT",
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
		credentials: "include",
	});
	return handleResponse(res, "Failed to update section");
}

// Delete section
export async function deleteSectionById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/section/${id}`, {
		method: "DELETE",
		headers: JSON_HEADERS,
		credentials: "include",
	});
	return handleResponse(res, "Failed to delete section");
}
