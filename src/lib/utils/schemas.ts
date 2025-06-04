import { z } from "zod";

export const loginFormSchema = z.object({
	email: z.string().trim().email("Please enter a valid email address").min(1, "Username is required"),
	password: z
		.string()
		.trim()
		.min(6, "Password must be at least 6 characters")
		.min(1, "Password is required")
});

export type LoginInput = z.infer<typeof loginFormSchema>;