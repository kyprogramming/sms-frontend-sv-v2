import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import type { FeeMasterPayload } from '$lib/utils/schemas';
import { handleResponse, JSON_HEADERS } from '$lib/utils/utils';


export async function createFeeMaster(data: FeeMasterPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-master`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
    return handleResponse(res, 'Failed to create fee master');
}
export async function fetchFeeMasters(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-master?${params.toString()}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee masters');
}

export async function fetchFeeMasterById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-master/${id}`, {
		method: 'GET',
		headers: JSON_HEADERS,
    });
	return handleResponse(res, 'Failed to fetch fee master');
}

export async function updateFeeMaster(id: string, data: FeeMasterPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-master/${id}`, {
		method: 'PUT',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update fee master');
}

export async function deleteFeeMasterById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-master/${id}`, {
		method: 'DELETE',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to delete fee master');
}
