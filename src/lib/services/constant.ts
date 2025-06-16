import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import { handleResponse } from '$lib/utils/utils';

export interface ConstantPayload {
	key: string;
	value: any;
	type: 'string' | 'number' | 'boolean' | 'json';
	category?: string;
	description?: string;
}

export async function createConstant(data: ConstantPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/constant`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to create constant');
}

export async function getConstants(params?: URLSearchParams) {
	const url = `${API_BASE_URL}/constant${params ? `?${params.toString()}` : ''}`;
	const res = await fetchWrapper(url, {
		method: 'GET',
	});
	return handleResponse(res, 'Failed to fetch constants');
}

export async function getConstantByKey(key: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/constant/key/${key}`, {
		method: 'GET',
	});
	return handleResponse(res, 'Failed to fetch constant');
}

export async function getConstantById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/constant/${id}`, { method: 'GET' });
	return handleResponse(res, 'Failed to fetch constant');
}

export async function getConstantsByCategory(category: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/constant/category/${category}`, {
		method: 'GET',
	});
	return handleResponse(res, 'Failed to fetch constants');
}

export async function updateConstant(key: string, data: Partial<ConstantPayload>) {
	const res = await fetchWrapper(`${API_BASE_URL}/constant/${key}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update constant');
}

export async function deleteConstant(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/constant/${id}`, {
		method: 'DELETE',
	});
	return handleResponse(res, 'Failed to delete constant');
}
