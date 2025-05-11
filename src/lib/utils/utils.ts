export function decodeJwt(token: string) {
	const payload = JSON.parse(atob(token.split(".")[1]));
	return payload;
}

// Default headers
export const JSON_HEADERS = {
	"Content-Type": "application/json",
};

// Centralized response handler
export function handleResponse(response: any, errorMessage: string) {
	if (!response?.success) {
		console.error(errorMessage, response);
		throw new Error(errorMessage);
	}
	return response;
}
