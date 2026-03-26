import { createTRPCContext } from "@trpc/tanstack-react-query"

import type { AppRouter } from "@boilerplate/api"

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()
