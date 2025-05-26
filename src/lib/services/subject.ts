import { API_BASE_URL } from "$lib/constants/env.config";
import { fetchWrapper } from "$lib/utils/fetchWrapper";
import { handleResponse, JSON_HEADERS } from "$lib/utils/utils";

// Subject interface
export interface ISubject {
    id: string;
    name: string;
}

// Payload interface for create/update
export interface SubjectPayload {
    name: string;
}

// Create subject
export async function createSubject(data: SubjectPayload) {
    const res = await fetchWrapper(`${API_BASE_URL}/subject`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return handleResponse(res, "Failed to create subject");
}

// Fetch multiple subjects
export async function fetchSubjects(params: URLSearchParams) {
    const res = await fetchWrapper(`${API_BASE_URL}/subject?${params.toString()}`, { method: "GET" });
    return handleResponse(res, "Failed to fetch subjects");
}

// Fetch single subject by ID
export async function fetchSubjectById(id: string) {
    const res = await fetchWrapper(`${API_BASE_URL}/subject/${id}`, { method: "GET" });
    return handleResponse(res, "Failed to fetch subject");
}

// Update subject
export async function updateSubject(id: string, data: SubjectPayload) {
    const res = await fetchWrapper(`${API_BASE_URL}/subject/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    return handleResponse(res, "Failed to update subject");
}

// Delete subject
export async function deleteSubjectById(id: string) {
    const res = await fetchWrapper(`${API_BASE_URL}/subject/${id}`, { method: "DELETE"});
    return handleResponse(res, "Failed to delete subject");
}
