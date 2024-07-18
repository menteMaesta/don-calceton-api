import vine from '@vinejs/vine'

export const storeOrderImageValidator = vine.compile(
  vine.object({
    params: vine.object({
      order_id: vine.number(),
    }),
    image: vine.file({
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    }),
  })
)
