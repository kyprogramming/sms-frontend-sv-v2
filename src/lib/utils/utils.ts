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


export function generateAdmissionNo(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");

	return `STU${year}${month}${day}${hours}${minutes}${seconds}`;
}