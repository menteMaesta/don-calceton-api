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
  })
)
