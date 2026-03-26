import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { expo } from "@better-auth/expo"
import { waitUntil } from "@vercel/functions"
import { betterAuth } from "better-auth"
import { haveIBeenPwned } from "better-auth/plugins"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import { accountsTable, sessionsTable, usersTable, verificationsTable } from "@boilerplate/db/schema"
import { db } from "@boilerplate/db/server"
import { ResetPasswordEmail, VerifyEmail } from "@boilerplate/email"

import { env } from "@/env"
import { sendAppEmail } from "@/lib/email/email.server"

function getFirstName(name: string | null | undefined) {
  if (!name) return "there"
  const [firstName] = name.trim().split(/\s+/)
  return firstName || "there"
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: { users: usersTable, sessions: sessionsTable, accounts: accountsTable, verifications: verificationsTable },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      waitUntil(
        sendAppEmail({
          to: user.email,
          subject: "Reset your Boilerplate password",
          react: ResetPasswordEmail({ firstName: getFirstName(user.name), resetUrl: url }),
        }),
      )
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      waitUntil(
        sendAppEmail({
          to: user.email,
          subject: "Verify your Boilerplate email",
          react: VerifyEmail({ firstName: getFirstName(user.name), verifyUrl: url }),
        }),
      )
    },
  },
  advanced: {
    backgroundTasks: { handler: waitUntil },
    database: { generateId: false },
  },
  plugins: [
    expo(),
    tanstackStartCookies(),
    ...(env.NODE_ENV !== "development"
      ? [
          haveIBeenPwned({
            customPasswordCompromisedMessage:
              "The password you have entered is too common or has been compromised. Please choose a different password.",
          }),
        ]
      : []),
  ],
  session: { cookieCache: { enabled: true } },
  trustedOrigins: [
    env.VITE_WEB_URL,
    "boilerplate://",
    "boilerplate://*",
    ...(env.NODE_ENV === "development" ? (["exp://", "exp://**", "exp://192.168.*.*:*/**"] as const) : []),
  ],
})
