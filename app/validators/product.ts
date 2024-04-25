import vine from '@vinejs/vine'

export const storeProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    description: vine.string().trim().escape().optional(),
    price: vine.number({ strict: true }),
    wholesalePrice: vine.number({ strict: true }).optional(),
  })
)

export const showProductValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string(),
    }),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string(),
    }),
    name: vine.string().trim().optional(),
    description: vine.string().trim().escape().optional(),
    price: vine.number({ strict: true }).optional(),
    wholesalePrice: vine.number({ strict: true }).optional(),
  })
)
