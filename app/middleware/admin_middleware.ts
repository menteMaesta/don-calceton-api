import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    if (!auth.user?.admin) {
      response.abort('User does not have correct permissions')
    } else {
      await next()
    }
  }
}
