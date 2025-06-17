import { z } from 'zod';
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Login Form Schema
// --------------------------------------------------------------------------------------------
export const loginFormSchema = z.object({
	email: z.string().trim().email('Please enter a valid email address').min(1, 'Username is required'),
	password: z.string().trim().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});
export type LoginFormDataType = z.infer<typeof loginFormSchema>;

// Section Form Schema
// --------------------------------------------------------------------------------------------
export const sectionFormSchema = z.object({
	name: z.string().min(1, 'Section name is required'),
	active: z.boolean().optional(),
});
export type SectionFormPayload = z.infer<typeof sectionFormSchema>;

// Class Form Schema
// --------------------------------------------------------------------------------------------
export const classFormSchema = z.object({
	name: z.string().min(1, 'Class name is required'),
	sectionIds: z.array(z.string()).min(1, 'Please select at least one section'),
	active: z.boolean().optional(),
});
export type ClassFormPayload = z.infer<typeof classFormSchema>;

// Subject Form Schema
// --------------------------------------------------------------------------------------------
export const subjectFormSchema = z.object({
	name: z.string().min(1, 'Subject name is required'),
	type: z.string().min(1, 'Please select a subject type'),
	code: z.string().optional(),
});
export type SubjectFormPayload = z.infer<typeof subjectFormSchema>;

// Academic Year Form Schema
// --------------------------------------------------------------------------------------------
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
export const feeCategoryFormSchema = z.object({
	name: z.string().min(1, 'Fee category name is required').max(100, 'Fee category name must be less than 100 characters'),
	description: z.string().max(500, 'Description must be less than 500 characters').optional(),
	active: z.boolean().optional().default(true),
});

export type FeeCategoryPayload = z.infer<typeof feeCategoryFormSchema>;

// Fee Group Form Schema
// --------------------------------------------------------------------------------------------
export const feeGroupFormSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		categoryId: z.string().min(1, 'Category is required'),
		amount: z.union([z.string().min(1, 'Amount is required'), z.number()]).transform((val) => {
			if (typeof val === 'string') {
				const num = parseFloat(val);
				return isNaN(num) ? val : num;
			}
			return val;
		}),
		description: z.string().optional(),
		active: z.boolean().optional().default(true),
	})
	.superRefine((data, ctx) => {
		const val = data.amount;
		if (val === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Amount is required',
				path: ['amount'],
			});
			return;
		}
		if (typeof val === 'number') {
			if (val <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Amount must be positive',
					path: ['amount'],
				});
			} else {
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
export type FeeGroupPayload = z.infer<typeof feeGroupFormSchema>;


// Fee Discount Schema
// --------------------------------------------------------------------------------------------
export const feeDiscountFormSchema = z
	.object({
		name: z.string().min(1, 'Discount name is required'),
		code: z.string().optional(),
		value: z
			.union([
				z.string().min(1, 'Value is required'), // Handles empty string case
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
		discountType: z.string().min(1, 'Discount type is required'),
		applicableTo: z.string().min(1, 'Applicable To is required'),
		expiryDate: z.string().min(1, 'Expiry Date is required'),
		active: z.boolean().optional().default(true),
	})
	.superRefine((data, ctx) => {
		const val = data.value;
		const discountType = data.discountType;
		if (val === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Value is required',
				path: ['value'],
			});
			return;
		}

		if (typeof val === 'number') {
			// Common validations
			if (val <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Value must be positive',
					path: ['value'],
				});
			}

			// Percentage-specific validations
			if (discountType === 'percentage') {
				if (val > 100) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Percentage cannot exceed 100%',
						path: ['value'],
					});
				}
			}
			// Fixed amount validations
			else {
				if (val > 99999) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Amount cannot exceed 99,999',
						path: ['value'],
					});
				}
			}
		}
	});

export type FeeDiscountPayload = z.infer<typeof feeDiscountFormSchema>;

// Constant Form Schema
// --------------------------------------------------------------------------------------------
export const constantFormSchema = z.object({
	key: z.string().min(1, 'Key is required'),
	value: z.union([z.string().min(1, 'Value is required'), z.number().min(0), z.boolean(), z.record(z.any())]),
	type: z.enum(['string', 'number', 'boolean', 'json']),
	category: z.string().optional(),
	description: z.string().optional(),
});

export type ConstantPayload = z.infer<typeof constantFormSchema>;
