import { z } from 'zod';

export const IdParamSchema = z.object({
    id: z.string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val) && val > 0, {
            message: "id must be a positive integer"
        })
});

export const PaginationQuerySchema = z.object({
    page: z.string()
        .optional()
        .transform((val) => val ? parseInt(val, 10) : 1)
        .refine((val) => !isNaN(val) && val > 0, {
            message: "page must be a positive integer"
        }),
    limit: z.string()
        .optional()
        .transform((val) => val ? parseInt(val, 10) : 10)
        .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
            message: "limit must be between 1 and 100"
        })
});
