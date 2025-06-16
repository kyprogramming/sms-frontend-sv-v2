import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import { handleResponse, JSON_HEADERS } from '$lib/utils/utils';

// Payload interface for create/update
export interface AcademicYearPayload {
	name: string;
	startDate: string;
	endDate: string;
	active?: boolean;
}

// Create academic-year
export async function createAcademicYear(data: AcademicYearPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/academic-year`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to create academic year');
}

// Fetch multiple academic-years
export async function fetchAcademicYears(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/academic-year?${params.toString()}`, { method: 'GET' });
	return handleResponse(res, 'Failed to fetch academic years');
}

// Fetch single academic-year by ID
export async function fetchAcademicYearById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/academic-year/${id}`, { method: 'GET' });
	return handleResponse(res, 'Failed to fetch academic year');
}

// Update academic-year
export async function updateAcademicYear(id: string, data: AcademicYearPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/academic-year/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update academic-year');
}

// Delete academic-year
export async function deleteAcademicYearById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/academic-year/${id}`, { method: 'DELETE' });
	return handleResponse(res, 'Failed to delete academic year');
}
