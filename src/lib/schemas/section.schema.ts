import { z } from 'zod';

export const sectionFormSchema = z.object({
    name: z.string().min(1, 'Section name is required'),
    active: z.boolean().optional(),
});
export type SectionFormPayload = z.infer<typeof sectionFormSchema>;