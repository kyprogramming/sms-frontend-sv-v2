import { z } from 'zod';

export const subjectFormSchema = z.object({
	name: z.string().min(1, 'Subject name is required'),
	type: z.string().min(1, 'Please select a subject type'),
	code: z.string().optional(),
	active: z.boolean().default(true),
});
export type SubjectFormPayload = z.infer<typeof subjectFormSchema>;