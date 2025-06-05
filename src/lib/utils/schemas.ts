import { z } from "zod";

// Login schema and type definition
export const loginFormSchema = z.object({
	email: z.string().trim().email("Please enter a valid email address").min(1, "Username is required"),
	password: z
		.string()
		.trim()
		.min(6, "Password must be at least 6 characters")
		.min(1, "Password is required")
});
export type LoginInputType = z.infer<typeof loginFormSchema>;


// Section schema and type definition
export const sectionFormSchema = z.object({
    name: z.string().min(1, "Section name is required")
});
export type SectionInputType = z.infer<typeof sectionFormSchema>;


// Class schema and type definition
export const classFormSchema = z.object({
	name: z.string().min(1, "Class name is required"),
	sectionIds: z.array(z.string()).min(1, "Please select at least one section")
});
export type ClassInputType = z.infer<typeof classFormSchema>;