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
    name: z.string().min(1, "Section name is required"),
    // description: z.string().optional(),
    // color: z.string().optional(),
});
// const sectionSchema = z.object({
//     name: z.string().min(1, "Section name is required"),
// });
export type SectionInputType = z.infer<typeof sectionFormSchema>;