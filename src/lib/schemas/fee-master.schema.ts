import { z } from 'zod';

export const FINE_TYPES = ['None', 'Fix', 'Percentage', 'Cumulative'] as const;

export const feeMasterFormSchema = z
	.object({
		feeGroupId: z.string().min(1, 'Fee group is required'),
		feeTypeId: z.string().min(1, 'Fee type is required'),
		amount: z
			.union([
				z.string().min(1, 'Amount is required'), // Handles empty string case
				z.number().min(0, 'Amount is required'),
			])
			.transform((val) => {
				// Convert string to number if possible
				if (typeof val === 'string') {
					const num = parseFloat(val);
					return isNaN(num) ? val : num;
				}
				return val;
			}),
		dueDate: z.string().min(1, 'Due date is required'),
		// .refine((val) => !isNaN(Date.parse(val)), {
		// 	message: 'Invalid date format',
		// }),
		fineType: z.enum(FINE_TYPES).default('None'),
		// fineValue: z.number().min(0).optional(),
		fineValue: z
			.union([
				z.number().min(0), // Valid number (≥0)
				z.string().transform((val) => {
					// Handle empty string → undefined
					return val === '' ? undefined : val;
				}),
				z.undefined(), // Explicitly allow undefined
				z.null(), // Optional: allow null
			])
			.transform((val) => {
				// Convert string to number if possible
				if (typeof val === 'string') {
					const num = parseFloat(val);
					return isNaN(num) ? val : num;
				}
				return val;
			})
			.optional(),

		// fineValue: z
		// 	.union([
		// 		z.string(), // Handles empty string case
		// 		z.number(),
		// 	])
		// 	.transform((val) => {
		// 		// Convert string to number if possible
		// 		if (typeof val === 'string') {
		// 			const num = parseFloat(val);
		// 			return isNaN(num) ? val : num;
		// 		}
		// 		return val;
		// 	}),
		perDay: z.boolean().optional().default(false),
		active: z.boolean().optional().default(true),
	})
	.superRefine((data, ctx) => {
		// Conditional validation for fineValue
		if (data.fineType !== 'None' && !data.fineValue) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Fine value is required when fine type is selected',
				path: ['fineValue'],
			});
		}
		// Validate fineValue based on type
		if (
			data.fineType === 'Percentage' &&
			data.fineValue !== '' &&
			data.fineValue !== null &&
			data.fineValue !== undefined &&
			typeof data.fineValue !== 'string' &&
			data.fineValue > 100
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Percentage cannot exceed 100%',
				path: ['fineValue'],
			});
		}

		// Validate perDay only applies to Fix/Percentage
		// if (data.perDay && !['Fix', 'Percentage'].includes(data.fineType)) {
		// 	ctx.addIssue({
		// 		code: z.ZodIssueCode.custom,
		// 		message: 'Per day only applies to Fixed or Percentage fines',
		// 		path: ['perDay'],
		// 	});
		// }
	});

export type FeeMasterPayload = z.infer<typeof feeMasterFormSchema>;