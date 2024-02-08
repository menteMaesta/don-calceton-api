import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/token'

export default class TokenController {
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = user.currentAccessToken

    await User.accessTokens.delete(user, token.identifier)
    response.send('Logout success')
  }
}
