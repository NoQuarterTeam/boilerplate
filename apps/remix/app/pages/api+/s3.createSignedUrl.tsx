import type { ActionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { z } from "zod"

import { formError, validateFormData } from "~/lib/form"

import { createSignedUrl } from "~/services/s3/s3.server"

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const creatSignedUrlSchema = z.object({ key: z.string().min(1) })
  const result = await validateFormData(creatSignedUrlSchema, formData)
  if (!result.success) return formError(result)
  return json(createSignedUrl(result.data.key))
}
