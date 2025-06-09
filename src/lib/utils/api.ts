export async function apiRequest<T>(url: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown, options?: RequestInit): Promise<T> {
	if (!url) throw new Error("URL is required for API request");
	if (!method) throw new Error("HTTP method is required for API request");

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
	// console.log("Data returned from API ::", data);
	if (!res.ok || !data.success) {
		if (data?.formattedError) {
			const errorMessage = Object.entries(data?.formattedError).map(([field, message]) => `${message}`).join(", ");
			throw new Error(errorMessage || "Request failed");
		} else {
			throw new Error(data?.error || "Request failed");
		}
	}
	return data;
}
