import type { inferRouterOutputs } from "@trpc/server"

import type { AppRouter } from "./router"

export { createTRPCContext } from "./init"
export { type AppRouter, appRouter } from "./router"

export type RouterOutputs = inferRouterOutputs<AppRouter>
