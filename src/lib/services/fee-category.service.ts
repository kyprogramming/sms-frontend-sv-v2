import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import { handleResponse, JSON_HEADERS } from '$lib/utils/utils';

// Payload interface for create/update
export interface FeeCategoryPayload {
	name: string;
	description?: string;
	active?: boolean;
}

// Create fee category
export async function createFeeCategory(data: FeeCategoryPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-category`, {
		method: 'POST',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to create fee category');
}

// Fetch multiple fee categories
export async function fetchFeeCategories(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-category?${params.toString()}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee categories');
}

// Fetch single fee category by ID
export async function fetchFeeCategoryById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-category/${id}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee category');
}

// Update fee category
export async function updateFeeCategory(id: string, data: FeeCategoryPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-category/${id}`, {
		method: 'PUT',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update fee category');
}

// Delete fee category
export async function deleteFeeCategoryById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-category/${id}`, {
		method: 'DELETE',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to delete fee category');
}
