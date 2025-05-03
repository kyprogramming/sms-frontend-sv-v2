import { ZodSchema } from "zod";
import type { Writable } from "svelte/store";


export async function validateForm<T>(
	schema: ZodSchema,
	data: T,
	formErrors: Writable<Partial<Record<keyof T, string>>>,
): Promise<boolean> {
	const result = schema.safeParse(data);

	if (!result.success) {
		const errors: Partial<Record<keyof T, string>> = {};
		result.error.errors.forEach((err) => {
			if (err.path.length > 0) {
				const key = err.path[0] as keyof T;
				errors[key] = err.message;
			}
		});
		formErrors.set(errors);
		return false;
	} else {
		formErrors.set({});
		return true;
	}
}
