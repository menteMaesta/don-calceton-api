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

export const validateForgotPasswordValidator = vine.compile(
  vine.object({
    forgot_token: vine.string(),
  })
)
