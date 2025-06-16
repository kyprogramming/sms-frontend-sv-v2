import { z } from 'zod';
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Login Form Schema
export const loginFormSchema = z.object({
	email: z
		.string()
		.trim()
		.email('Please enter a valid email address')
		.min(1, 'Username is required'),
	password: z
		.string()
		.trim()
		.min(6, 'Password must be at least 6 characters')
		.min(1, 'Password is required'),
});
export type LoginFormDataType = z.infer<typeof loginFormSchema>;

// Section Form Schema
export const sectionFormSchema = z.object({
	name: z.string().min(1, 'Section name is required'),
});
export type SectionFormDataType = z.infer<typeof sectionFormSchema>;

// Class Form Schema
export const classFormSchema = z.object({
	name: z.string().min(1, 'Class name is required'),
	sectionIds: z.array(z.string()).min(1, 'Please select at least one section'),
});
export type ClassFormDataType = z.infer<typeof classFormSchema>;

// Subject Form Schema
export const subjectFormSchema = z.object({
	name: z.string().min(1, 'Subject name is required'),
	type: z.string().min(1, 'Please select a subject type'),
	code: z.string().optional(),
});
export type SubjectFormDataType = z.infer<typeof subjectFormSchema>;

// Academic Year Form Schema
export const academicYearFormSchema = z.object({
	name: z.string().min(1, 'Academic Year Name is required'),
	startDate: z.string().min(1, 'Start date is required'),
	// .regex(dateRegex, "Date must be in YYYY-MM-DD format"),
	// .transform((val) => new Date(val)),
	endDate: z.string().min(1, 'End date is required'),
	// .regex(dateRegex, "Date must be in YYYY-MM-DD format"),
	// .transform((val) => new Date(val)),
	active: z.boolean().optional(),
});
export type AcademicYearFormDataType = z.infer<typeof academicYearFormSchema>;

// Academic Year Form Schema
export const feeCategoryFormSchema = z.object({
	name: z
		.string()
		.min(1, 'Fee category name is required')
		.max(100, 'Fee category name must be less than 100 characters'),
	description: z.string().max(500, 'Description must be less than 500 characters').optional(),
	active: z.boolean().optional().default(true),
});

export type FeeCategoryFormDataType = z.infer<typeof feeCategoryFormSchema>;

// Fee Head Form Schema
export const feeHeadFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	categoryId: z.string().min(1, 'Category is required'),
	amount: z.union([
		z.number().min(0, 'Amount must be positive'),
		z
			.string()
			.min(1, 'Amount is required')
			.refine((val) => /^\d*\.?\d*$/.test(val), 'Must be a valid number')
			.transform((val) => parseFloat(val))
			.refine((val) => !isNaN(val), 'Invalid number')
			.refine((val) => val >= 0, 'Amount must be positive'),
	]),
	description: z.string().optional(),
});

export type FeeHeadFormDataType = z.infer<typeof feeHeadFormSchema>;

// Constant Form Schema
export const constantFormSchema = z.object({
	key: z.string().min(1, 'Key is required'),
	value: z.union([
		z.string().min(1, 'Value is required'),
		z.number().min(0),
		z.boolean(),
		z.record(z.any()),
	]),
	type: z.enum(['string', 'number', 'boolean', 'json']),
	category: z.string().optional(),
	description: z.string().optional(),
});

export type ConstantFormDataType = z.infer<typeof constantFormSchema>;