
import { formErrors } from "$lib/stores/formStore";
import type { ZodSchema, ZodError } from "zod";

type FormErrors<T> = Partial<Record<keyof T, string>>;

export function validateForm<T>(schema: ZodSchema<T>, data: T): boolean {
	const result = schema.safeParse(data);

	if (!result.success) {
		const errors: FormErrors<T> = {};
		const zodError = result.error as ZodError<T>;

		zodError.errors.forEach((err) => {
			if (err.path.length > 0) {
				const key = err.path[0] as keyof T;
				errors[key] = err.message;
			}
		});

		formErrors.set(errors);
		return false;
	}

	formErrors.set({});
	return true;
}
