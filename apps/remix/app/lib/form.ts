import type { z } from "zod"

export type FieldErrors<T> = {
  [Property in keyof T]: string[]
}

type ValidForm<Schema extends z.ZodType<unknown>> = {
  data: z.infer<Schema>
  fieldErrors?: FieldErrors<Schema>
}

export async function validateFormData<Schema extends z.ZodType<unknown>>(
  schema: Schema,
  formData: FormData,
): Promise<ValidForm<Schema>> {
  const data = Object.fromEntries(formData)

  const filteredData = Object.keys(data).reduce((acc, key) => {
    acc[key] = data[key] === "" ? null : (data[key] as string)
    return acc
  }, {} as { [key: string]: string | null })
  const validations = schema.safeParse(filteredData)

  if (!validations.success) {
    const fieldErrors = validations.error.flatten().fieldErrors as FieldErrors<Schema>
    return { fieldErrors, data }
  }
  return { data: validations.data }
}

export type ActionData<T> = {
  formError?: string
  fieldErrors?: FieldErrors<T>
  data?: T
}

export const getFormDataArray = (formData: FormData, field: string) =>
  [...formData.entries()]
    .filter(([key]) => key.startsWith(field))
    .reduce((acc, [key, value]) => {
      const [prefix, name] = key.split(".")
      const id = Number(prefix.charAt(prefix.lastIndexOf("[") + 1))
      acc[id] = {
        ...acc[id],
        [name]: value as string | undefined,
      }
      return acc
    }, [] as Array<Record<string, string | undefined>>)
