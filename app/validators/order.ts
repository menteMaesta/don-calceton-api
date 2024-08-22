import vine from '@vinejs/vine'
import { STATUS } from '#app/constants'

export const indexOrdersValidator = vine.compile(
  vine.object({
    status: vine.enum(STATUS).optional(),
  })
)

export const storeOrderValidator = vine.compile(
  vine.object({
    customizationId: vine.number(),
    variantId: vine.number(),
    imageSize: vine.number(),
    quantity: vine.number(),
    status: vine.enum(STATUS),
    invoiceId: vine.string().optional(),
    customId: vine.string().optional(),
  })
)

export const verifyQuantityValidator = vine.compile(
  vine.object({
    orders: vine.array(vine.object({ variantId: vine.number(), quantity: vine.number() })),
  })
)
