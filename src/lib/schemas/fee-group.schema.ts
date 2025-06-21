import { z } from 'zod';

export const feeGroupFormSchema = z.object({
	name: z.string().min(1, 'Group name is required'),
	code: z.string().optional(),
	// categoryId: z.string().min(1, 'Category is required'),
	// amount: z.union([z.string().min(1, 'Amount is required'), z.number()]).transform((val) => {
	// 	if (typeof val === 'string') {
	// 		const num = parseFloat(val);
	// 		return isNaN(num) ? val : num;
	// 	}
	// 	return val;
	// }),
	description: z.string().optional(),
	active: z.boolean().optional().default(true),
});
// .superRefine((data, ctx) => {
// 	const val = data.amount;
// 	if (val === '') {
// 		ctx.addIssue({
// 			code: z.ZodIssueCode.custom,
// 			message: 'Amount is required',
// 			path: ['amount'],
// 		});
// 		return;
// 	}
// 	if (typeof val === 'number') {
// 		if (val <= 0) {
// 			ctx.addIssue({
// 				code: z.ZodIssueCode.custom,
// 				message: 'Amount must be positive',
// 				path: ['amount'],
// 			});
// 		} else {
// 			if (val > 99999) {
// 				ctx.addIssue({
// 					code: z.ZodIssueCode.custom,
// 					message: 'Amount cannot exceed 99,999',
// 					path: ['amount'],
// 				});
// 			}
// 		}
// 	}
// });
export type FeeGroupPayload = z.infer<typeof feeGroupFormSchema>;