import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'
import { randomBytes } from 'crypto'
import env from '#start/env'
import {
  loginValidator,
  generateForgotPasswordValidator,
  validateForgotPasswordValidator,
} from '#validators/token'

export default class TokenController {
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    return token
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = user.currentAccessToken

    await User.accessTokens.delete(user, token.identifier)
    response.send('Logout success')
  }

  async generateForgotPasswordLink({ request, response }: HttpContext) {
    const randomValue = randomBytes(10).toString('hex')
    const { email } = await request.validateUsing(generateForgotPasswordValidator)
    const user = await User.findByOrFail('email', email)

    user.forgot_pass_token = randomValue
    user.save()
    const encrypted = encryption.encrypt(randomValue, '2 hours')

    await mail.send((message) => {
      message
        .to(user.email)
        .from('don.calceton@mail.com')
        .subject('Restablece tu contraseña don calcetón')
        .text(
          `Da click a este link para restablecer tu contraseña: ${env.get('FRONTEND_BASE_URL')}/${encrypted}/change_password`
        )
    })
    response.send(encrypted)
  }

  async validateForgotPasswordLink({ request, response }: HttpContext) {
    const { forgot_token } = await request.validateUsing(validateForgotPasswordValidator)
    const decriptedValue = encryption.decrypt(forgot_token)
    const user = await User.findByOrFail('forgot_pass_token', decriptedValue)

    const isValid = decriptedValue === user.forgot_pass_token

    if (isValid) {
      user.forgot_pass_token = ''
      user.save()
    }

    response.send(isValid)
  }
}
