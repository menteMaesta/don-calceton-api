import vine from '@vinejs/vine'

export const storeImageValidator = vine.compile(
  vine.object({
    params: vine.object({
      variant_id: vine.string(),
    }),
    image: vine.file({
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })
)

export const updateImageValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().trim(),
    }),
    image: vine.file({
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })
)

export const destroyImageValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().trim(),
    }),
  })
)
