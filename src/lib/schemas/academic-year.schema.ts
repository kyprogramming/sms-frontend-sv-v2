import { z } from 'zod';

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
export type AcademicYearPayload = z.infer<typeof academicYearFormSchema>;

// Academic Year Form Schema
export const feeTypeFormSchema = z.object({
	name: z
		.string()
		.min(1, 'Fee Type name is required')
		.max(100, 'Fee Type name must be less than 100 characters'),
	code: z.string().optional(),
	description: z.string().max(500, 'Description must be less than 500 characters').optional(),
	active: z.boolean().optional().default(true),
});

export type FeeTypePayload = z.infer<typeof feeTypeFormSchema>;
