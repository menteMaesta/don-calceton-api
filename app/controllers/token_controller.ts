import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'
import { randomBytes } from 'node:crypto'
import env from '#start/env'
import {
  loginValidator,
  generateForgotPasswordValidator,
  updatePasswordValidator,
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
    response.send({ message: 'Success' })
  }

  async updatePassword({ request, response }: HttpContext) {
    const { newPassword, forgotToken } = await request.validateUsing(updatePasswordValidator)
    const decriptedValue = encryption.decrypt(forgotToken)
    const user = await User.findByOrFail('forgot_pass_token', decriptedValue)

    const isValid =
      user.forgot_pass_token && decriptedValue ? decriptedValue === user.forgot_pass_token : false

    if (isValid) {
      user.forgot_pass_token = ''
      user.password = newPassword
      user.save()
    }
    const updatedUser = user.serialize()

    response.send(updatedUser)
  }
}
