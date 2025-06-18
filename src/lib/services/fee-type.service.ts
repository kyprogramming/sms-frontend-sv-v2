import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import { handleResponse, JSON_HEADERS } from '$lib/utils/utils';

// Payload interface for create/update
export interface FeeTypePayload {
	name: string;
	description?: string;
	active?: boolean;
}

// Create fee type
export async function createFeeType(data: FeeTypePayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-type`, {
		method: 'POST',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to create fee type');
}

// Fetch multiple fee categories
export async function fetchFeeTypes(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-type?${params.toString()}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee categories');
}

// Fetch single fee type by ID
export async function fetchFeeTypeById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-type/${id}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee type');
}

// Update fee type
export async function updateFeeType(id: string, data: FeeTypePayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-type/${id}`, {
		method: 'PUT',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update fee type');
}

// Delete fee type
export async function deleteFeeTypeById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-type/${id}`, {
		method: 'DELETE',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to delete fee type');
}
