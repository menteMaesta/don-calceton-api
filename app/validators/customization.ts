import vine from '@vinejs/vine'

export const indexCustomizationValidator = vine.compile(
  vine.object({
    params: vine.object({
      product_id: vine.string(),
    }),
  })
)

export const storeCustomizationValidator = vine.compile(
  vine.object({
    params: vine.object({
      product_id: vine.string(),
    }),
    title: vine.string().trim(),
    maxSize: vine.number({ strict: true }).optional(),
    minSize: vine.number({ strict: true }).optional(),
  })
)

export const updateCustomizationValidator = vine.compile(
  vine.object({
    params: vine.object({
      product_id: vine.string(),
      id: vine.string(),
    }),
    title: vine.string().trim(),
    maxSize: vine.number({ strict: true }).optional(),
    minSize: vine.number({ strict: true }).optional(),
  })
)

export const deleteCustomizationValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string(),
    }),
  })
)
