import * as z from "zod"

export const tablePaginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(50).optional().default(10),
  search: z.string().trim().max(100).optional(),
})
