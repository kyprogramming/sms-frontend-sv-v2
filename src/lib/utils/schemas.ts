import { z } from "zod";

// Login Form Schema
export const loginFormSchema = z.object({
	email: z.string().trim().email("Please enter a valid email address").min(1, "Username is required"),
	password: z.string().trim().min(6, "Password must be at least 6 characters").min(1, "Password is required"),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;

// Section Form Schema
export const sectionFormSchema = z.object({
	name: z.string().min(1, "Section name is required"),
});
export type SectionFormType = z.infer<typeof sectionFormSchema>;

// Class Form Schema
export const classFormSchema = z.object({
	name: z.string().min(1, "Class name is required"),
	sectionIds: z.array(z.string()).min(1, "Please select at least one section"),
});
export type ClassFormType = z.infer<typeof classFormSchema>;

// Subject Form Schema
export const subjectFormSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
	code: z.string().optional(),
    type: z.number().min(1, "Please select a subject type"),
});
export type SubjectFormType = z.infer<typeof subjectFormSchema>;
