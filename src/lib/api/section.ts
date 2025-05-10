import { API_BASE_URL } from "$lib/constants/env.config";
import { isLoading } from "$lib/stores/loading";

export interface ISection extends Document {
	name: string;
}

export async function createSection(data: any) {
	try {
		const res = await fetch(`${API_BASE_URL}/section`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
			credentials: "include",
		});
		if (!res.ok) throw new Error("Failed to create section");
		return await res.json();
	} finally {
		isLoading.set(false);
	}
}

export async function getSections(params: URLSearchParams) {
	try {
		isLoading.set(true);
		const res = await fetch(`${API_BASE_URL}/section?${params.toString()}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		if (!res.ok) throw new Error("Failed to create section");
		return await res.json();
	} finally {
		isLoading.set(false);
	}
}

export async function getSectionById(id: string) {
	try {
		const res = await fetch(`${API_BASE_URL}/section/${id}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		if (!res.ok) throw new Error("Failed to create section");
		return await res.json();
	} finally {
		isLoading.set(false);
	}
}

export async function updateSection(id: string, data: { name: string }) {
	try {
		const res = await fetch(`${API_BASE_URL}/section/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
			credentials: "include",
		});
		if (!res.ok) throw new Error("Failed to update section");
		return await res.json();
	} finally {
		isLoading.set(false);
	}
}

export async function deleteSectionById(id: string) {
	try {
		const res = await fetch(`${API_BASE_URL}/section/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		if (!res.ok) throw new Error("Failed to create section");
		return await res.json();
	} finally {
		isLoading.set(false);
	}
}
