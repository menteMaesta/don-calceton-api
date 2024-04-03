import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().toLowerCase().trim(),
    password: vine.string().trim(),
  })
)

export const generateForgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().toLowerCase().trim(),
  })
)

export const updatePasswordValidator = vine.compile(
  vine.object({
    newPassword: vine.string(),
    forgotToken: vine.string(),
  })
)
