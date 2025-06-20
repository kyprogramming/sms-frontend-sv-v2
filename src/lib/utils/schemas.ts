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
export const feeTypeFormSchema = z.object({
	name: z.string().min(1, 'Fee Type name is required').max(100, 'Fee Type name must be less than 100 characters'),
	code: z.string().optional(),
	description: z.string().max(500, 'Description must be less than 500 characters').optional(),
	active: z.boolean().optional().default(true),
});

export type FeeTypePayload = z.infer<typeof feeTypeFormSchema>;

// Fee Group Form Schema
// --------------------------------------------------------------------------------------------
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

// Fee Master Schema
// --------------------------------------------------------------------------------------------
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


// Fee Assignment Schema
// --------------------------------------------------------------------------------------------
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