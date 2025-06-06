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

export function getCurrentAcademicYear(date: Date = new Date()): string {
	const currentYear = date.getFullYear();
	const currentMonth = date.getMonth(); // 0-11 (Jan-Dec)

	// If month is June or before (Jan-Jun), session is previous year-current year
	// If month is July or after (Jul-Dec), session is current year-next year
	if (currentMonth < 6) {
		// January-June (0-5)
		return `${currentYear - 1}-${currentYear}`;
	} else {
		// July-December (6-11)
		return `${currentYear}-${currentYear + 1}`;
	}
}

export function formatDateToLocalYYYYMMDD(date: Date | null): string {
	if (!date) return "";

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export function isEqual(obj1: any, obj2: any): boolean {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function isFieldUnchanged<T, K extends keyof T>(original: T, input: Pick<T, K>, key: K): boolean {
	return original[key] === input[key];
}

export function areFieldsUnchanged<T>(original: T, input: Partial<T>, fields: (keyof T)[]): boolean {
	return fields.every((field) => original[field] === input[field]);
}

export function getFieldNames(obj: any, parentKey = ""): string[] {
	const keys: string[] = [];

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const fullKey = parentKey ? `${parentKey}.${key}` : key;
			const value = obj[key];

			if (value && typeof value === "object" && !Array.isArray(value) && value !== null) {
				keys.push(...getFieldNames(value, fullKey)); // Recursive call
			} else {
				keys.push(fullKey);
			}
		}
	}

	return keys;
}