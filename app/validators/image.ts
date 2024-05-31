import vine from '@vinejs/vine'

export const storeImageValidator = vine.compile(
  vine.object({
    params: vine.object({
      variant_id: vine.string(),
    }),
    image: vine.file({
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    }),
  })
)

export const bulkStoreImageValidator = vine.compile(
  vine.object({
    params: vine.object({
      variant_id: vine.string().trim(),
    }),
    images: vine.array(
      vine.file({
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
      })
    ),
  })
)

export const updateImageValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().trim(),
    }),
    image: vine.file({
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
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
