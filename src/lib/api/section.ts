import { API_BASE_URL } from "$lib/constants/env.config";
import { isLoading } from "$lib/stores/loading";
import { fetchWrapper } from "$lib/utils/fetchWrapper";

export interface ISection extends Document {
	name: string;
}

export async function createSection(data: any) {
	const res = await fetchWrapper(`${API_BASE_URL}/section`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
		credentials: "include",
	});
	if (!res.success) throw new Error("Failed to create section");
	return res;
}

export async function getSections(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/section?${params.toString()}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	});
	if (!res.success) throw new Error("Failed to create section");
	return res;
}

export async function getSectionById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/section/${id}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	});
	if (!res.success) throw new Error("Failed to create section");
	return res;
}

export async function updateSection(id: string, data: { name: string }) {
	const res = await fetchWrapper(`${API_BASE_URL}/section/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
		credentials: "include",
	});
	if (!res.success) throw new Error("Failed to update section");
	return res;
}

export async function deleteSectionById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/section/${id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	});
	if (!res.success) throw new Error("Failed to delete section");
	return res;
}
