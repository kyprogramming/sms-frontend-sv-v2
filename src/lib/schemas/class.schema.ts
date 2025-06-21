import { z } from 'zod';

export const classFormSchema = z.object({
	name: z.string().min(1, 'Class name is required'),
	sectionIds: z.array(z.string()).min(1, 'Please select at least one section'),
	active: z.boolean().optional(),
});
export type ClassFormPayload = z.infer<typeof classFormSchema>;