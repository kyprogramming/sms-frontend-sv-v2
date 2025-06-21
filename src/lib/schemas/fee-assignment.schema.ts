import { z } from 'zod';

export const createFeeAssignmentSchema = z.object({
	studentId: z.string().min(1, 'Student is required'),
	feeMasterId: z.string().min(1, 'Fee master is required'),
	amount: z
		.union([
			z.string().min(1, 'Amount is required'), // Handles empty string case
			z.number(),
		])
		.transform((val) => {
			// Convert string to number if possible
			if (typeof val === 'string') {
				const num = parseFloat(val);
				return isNaN(num) ? val : num;
			}
			return val;
		}),
	isPaid: z.boolean().optional().default(false),
	dueDate: z
		.string()
		.min(1, 'Due date is required')
		.refine((val) => !isNaN(Date.parse(val)), {
			message: 'Invalid date format',
		}),
	paidDate: z
		.string()
		.transform((val) => (val === '' ? '' : new Date(val)))
		.optional(),
	fineApplied: z.number().min(0).optional().default(0),
	academicYear: z.string().min(1, 'Academic year is required'),
});

export type FeeAssignmentPayload = z.infer<typeof createFeeAssignmentSchema>;