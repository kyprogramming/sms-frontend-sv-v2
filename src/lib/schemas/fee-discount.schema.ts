import { z } from 'zod';

export const feeDiscountFormSchema = z
	.object({
		name: z.string().min(1, 'Discount name is required'),
		code: z.string().optional(),
		amount: z.union([z.string().min(1, 'Amount is required'), z.number()]).transform((val) => {
			// Convert string to number if possible
			if (typeof val === 'string') {
				const num = parseFloat(val);
				return isNaN(num) ? val : num;
			}
			return val;
		}),
		discountType: z.string().min(1, 'Discount type is required'),
		applicableTo: z.string().min(1, 'Applicable To is required'),
		expiryDate: z.string().min(1, 'Expiry Date is required'),
		active: z.boolean().optional().default(true),
	})
	.superRefine((data, ctx) => {
		const val = data.amount;
		const discountType = data.discountType;
		if (val === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Amount is required',
				path: ['amount'],
			});
			return;
		}

		if (typeof val === 'number') {
			// Common validations
			if (val <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Amount must be positive',
					path: ['amount'],
				});
			}

			// Percentage-specific validations
			if (discountType === 'percentage') {
				if (val > 100) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Percentage cannot exceed 100%',
						path: ['amount'],
					});
				}
			}
			// Fixed amount validations
			else {
				if (val > 99999) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Amount cannot exceed 99,999',
						path: ['amount'],
					});
				}
			}
		}
	});

export type FeeDiscountPayload = z.infer<typeof feeDiscountFormSchema>;