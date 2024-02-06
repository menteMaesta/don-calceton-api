import vine from '@vinejs/vine'

export const storeSessionValidator = vine.compile(
  vine.object({
    email: vine.string().email().toLowerCase().trim(),
    password: vine.string().trim(),
  })
)
