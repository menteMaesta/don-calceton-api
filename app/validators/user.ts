import vine from '@vinejs/vine'

export const storeUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    email: vine.string().email().toLowerCase().trim(),
    password: vine.string().trim(),
    admin: vine.boolean().optional(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().trim(),
    }),
    fullName: vine.string().trim().optional(),
    password: vine.string().trim().optional(),
    admin: vine.boolean().optional(),
  })
)

export const destroyUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().trim(),
    }),
  })
)
