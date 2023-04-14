import type { User } from "@boilerplate/database/types"
import { ResetPasswordEmail } from "@boilerplate/emails"

import { FULL_WEB_URL } from "~/lib/config.server"
import { mailer } from "~/lib/mailer.server"

export async function sendResetPasswordEmail(user: User, token: string) {
  try {
    if (!user.email) return

    await mailer.send({
      react: <ResetPasswordEmail link={`${FULL_WEB_URL}/reset-password/${token}`} />,
      to: user.email,
      from: "info@noquarter.co",
      subject: "Reset Password",
    })
  } catch (error) {
    console.log(error)
  }
}
