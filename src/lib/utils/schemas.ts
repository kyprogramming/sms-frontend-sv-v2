import { z } from "zod";
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Login Form Schema
export const loginFormSchema = z.object({
	email: z.string().trim().email("Please enter a valid email address").min(1, "Username is required"),
	password: z.string().trim().min(6, "Password must be at least 6 characters").min(1, "Password is required"),
});
export type LoginFormDataType = z.infer<typeof loginFormSchema>;

// Section Form Schema
export const sectionFormSchema = z.object({
	name: z.string().min(1, "Section name is required"),
});
export type SectionFormDataType = z.infer<typeof sectionFormSchema>;

// Class Form Schema
export const classFormSchema = z.object({
	name: z.string().min(1, "Class name is required"),
	sectionIds: z.array(z.string()).min(1, "Please select at least one section"),
});
export type ClassFormDataType = z.infer<typeof classFormSchema>;

// Subject Form Schema
export const subjectFormSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    type: z.string().min(1, "Please select a subject type"),
	code: z.string().optional(),
});
export type SubjectFormDataType = z.infer<typeof subjectFormSchema>;



// Academic Year Form Schema
export const academicYearFormSchema = z.object({
	name: z.string().min(1, "Academic Year Name is required"),
	startDate: z
		.string()
		.min(1, "Start date is required"),
		// .regex(dateRegex, "Date must be in YYYY-MM-DD format"),
		// .transform((val) => new Date(val)),
	endDate: z
		.string()
		.min(1, "End date is required"),
		// .regex(dateRegex, "Date must be in YYYY-MM-DD format"),
		// .transform((val) => new Date(val)),
	active: z.boolean().optional(),
});
export type AcademicYearFormDataType = z.infer<typeof academicYearFormSchema>;