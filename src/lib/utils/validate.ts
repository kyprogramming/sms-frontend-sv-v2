import { formErrors } from "$lib/stores/formStore";
import type { ZodSchema, z } from "zod";

export type FormErrors = Partial<Record<any, any>>;

// export function validateForm<T>(schema: ZodSchema<T>, data: T): boolean {
// 	const result = schema.safeParse(data);

// 	if (!result.success) {
// 		const errors: FormErrors<T> = {};
// 		const zodError = result.error as ZodError<T>;

// 		zodError.errors.forEach((err) => {
// 			if (err.path.length > 0) {
// 				const key = err.path[0] as keyof T;
// 				errors[key] = err.message;
// 			}
// 		});

//         formErrors.set(errors);
//         formErrors.subscribe(($formErrors) => {
// 					console.log("formErrors", $formErrors);
// 					// Optional: log all field names with errors
// 					const errorKeys = Object.keys($formErrors);
// 					console.log("Fields with errors:", errorKeys);
//         })();

// 		return false;
// 	}

// 	formErrors.set({});
// 	return true;
// }

export function validateForm<T>(schema: ZodSchema<T>, data: T): boolean {
	const result = schema.safeParse(data);

	if (!result.success) {
		const mapped = flattenErrors(result.error.format());
		formErrors.set(mapped);
		// Optional: log all field names with errors
		formErrors.subscribe(($formErrors) => {
			const errorKeys = Object.keys($formErrors);
			console.log("Fields with errors:", errorKeys);
        })();
        return false;
	}

	formErrors.set({});
	return true;
}

export function flattenErrors<T>(error: z.ZodFormattedError<T>): FormErrors {
	const result: FormErrors = {};

	function recurse(err: z.ZodFormattedError<any> | { _errors: any[] }, path: any[] = []) {
		// Only proceed with objects
		if (typeof err !== "object" || err === null) return;

		for (const key in err) {
			if (key === "_errors") {
				const messages = (err as { _errors: any[] })._errors;
				if (messages.length > 0) {
					const fullPath = path.join(".");
					result[fullPath] = messages[0];
				}
			} else {
				recurse((err as Record<string, any>)[key], [...path, key]);
			}
		}
	}
	recurse(error);
	return result;
}
