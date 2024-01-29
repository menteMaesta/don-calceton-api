import vine from '@vinejs/vine'

export const listVariantsValidator = vine.compile(
  vine.object({
    params: vine.object({
      product_id: vine.string(),
    }),
  })
)

export const storeVariantValidator = vine.compile(
  vine.object({
    params: vine.object({
      product_id: vine.string(),
    }),
    name: vine.string().trim(),
    quantity: vine.number({ strict: true }),
  })
)

export const showVariantValidator = vine.compile(
  vine.object({
    params: vine.object({
      product_id: vine.string(),
      id: vine.string(),
    }),
  })
)

export const updateVariantValidator = vine.compile(
  vine.object({
    params: vine.object({
      product_id: vine.string(),
      id: vine.string(),
    }),
    name: vine.string().trim().optional(),
    quantity: vine.number({ strict: true }).optional(),
  })
)
