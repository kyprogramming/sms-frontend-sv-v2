import { z } from "zod";

export type DeepBoolean<T> = T extends object ? { [K in keyof T]?: DeepBoolean<T[K]> } : boolean;

export const documentSchema = z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    url: z.string().optional(),
    uploadedAt: z.string().optional(),
});
