import vine from '@vinejs/vine'
export const storeOrderValidator = vine.compile(
  vine.object({
    customizationId: vine.number({ strict: true }),
    variantId: vine.number({ strict: true }),
    imageSize: vine.number({ strict: true }),
    quantity: vine.number({ strict: true }),
    status: vine.enum(['ACTIVE', 'IN_PROGRESS', 'DONE']),
    images: vine.array(
      vine.file({
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
      })
    ),
  })
)
