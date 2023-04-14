import { json } from "@remix-run/node"

export const badRequest = (data: unknown, init?: ResponseInit) => json(data, { status: 400, ...init })
export const notFound = (data: unknown) => json(data, { status: 404 })
