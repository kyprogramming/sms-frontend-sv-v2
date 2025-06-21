import type { FeeGroupPayload } from '$lib/schemas/fee-group.schema';
import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import { handleResponse, JSON_HEADERS } from '$lib/utils/utils';


export async function createFeeGroup(data: FeeGroupPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group`, {
		method: 'POST',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to create fee group');
}

export async function fetchFeeGroups(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group?${params.toString()}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee groups');
}

export async function fetchFeeGroupById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group/${id}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee group');
}

export async function updateFeeGroup(id: string, data: FeeGroupPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group/${id}`, {
		method: 'PUT',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update fee group');
}

export async function deleteFeeGroupById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group/${id}`, {
		method: 'DELETE',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to delete fee group');
}
