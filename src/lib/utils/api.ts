export async function apiRequest<T>(url: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown, options?: RequestInit): Promise<T> {
	const res = await fetch(url, {
		method,
		headers: {
			"Content-Type": "application/json",
			...(options?.headers || {}),
		},
		credentials: "include",
		...(body ? { body: JSON.stringify(body) } : {}),
		...options,
	});

	const data = await res.json();

	if (!res.ok || !data.success) {
		throw new Error(data.message || "Request failed");
	}

	return data;
}
