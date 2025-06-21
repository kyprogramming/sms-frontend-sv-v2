import { z } from 'zod';

export const constantFormSchema = z.object({
	key: z.string().min(1, 'Key is required'),
	value: z.union([
		z.string().min(1, 'Amount is required'),
		z.number().min(0),
		z.boolean(),
		z.record(z.any()),
	]),
	type: z.enum(['string', 'number', 'boolean', 'json']),
	category: z.string().optional(),
	description: z.string().optional(),
});

export type ConstantPayload = z.infer<typeof constantFormSchema>;
