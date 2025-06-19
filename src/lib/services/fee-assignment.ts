import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import type { FeeAssignmentPayload } from '$lib/utils/schemas';
import { handleResponse, JSON_HEADERS } from '$lib/utils/utils';

export async function createFeeAssignment(data: FeeAssignmentPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-assignment`, {
		method: 'POST',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to create assignment');
}

export async function fetchFeeAssignments(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-assignment?${params.toString()}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch assignments');
}

export async function fetchFeeAssignmentById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-assignment/${id}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch assignment');
}

export async function updateFeeAssignment(id: string, data: FeeAssignmentPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-assignment/${id}`, {
		method: 'PUT',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update assignment');
}

export async function deleteFeeAssignmentById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-assignment/${id}`, {
		method: 'DELETE',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to delete assignment');
}
