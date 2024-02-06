import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { storeSessionValidator } from '#validators/session'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(storeSessionValidator)
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    response.send('Login success')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.send('Logout success')
  }
}
