import vine from '@vinejs/vine'
import { STATUS } from '#app/constants'

export const indexOrdersValidator = vine.compile(
  vine.object({
    status: vine.enum(STATUS).optional(),
  })
)

export const storeOrderValidator = vine.compile(
  vine.object({
    customizationId: vine.number({ strict: true }),
    variantId: vine.number({ strict: true }),
    imageSize: vine.number({ strict: true }),
    quantity: vine.number({ strict: true }),
    status: vine.enum(STATUS),
    images: vine.array(
      vine.file({
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
      })
    ),
  })
)
