import { API_BASE_URL } from "$lib/constants/env.config";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
	const res = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	// console.log("Server Response", res);
	return new Response(res.body, {
		status: res.status,
		headers: res.headers,
	});
};
