import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { storeUserValidator, updateUserValidator, destroyUserValidator } from '#validators/user'

export default class UsersController {
  async store({ request, response }: HttpContext) {
    const newUserData = await request.validateUsing(storeUserValidator)
    const newUser = await User.create(newUserData)

    if (newUser.$isPersisted) {
      const userJson = newUser.serialize()
      response.send(userJson)
    } else {
      response.abort({ message: 'can not add user' })
    }
  }

  async update({ request, response }: HttpContext) {
    const {
      params: { id: userId },
      ...data
    } = await request.validateUsing(updateUserValidator)
    const user = await User.findOrFail(userId)

    if (data.admin !== undefined) {
      user.admin = data.admin
    }
    if (data.password) {
      user.password = data.password
    }
    if (data.fullName) {
      user.fullName = data.fullName
    }

    if (data.admin !== undefined || data.password || data.fullName) {
      user.save()
    }
    const userJson = user.serialize()

    response.send(userJson)
  }

  async destroy({ request, response }: HttpContext) {
    const payload = await request.validateUsing(destroyUserValidator)
    const userId = payload.params.id
    const user = await User.findOrFail(userId)
    await user.delete()
    response.send(`id of deleted user: ${user.id}`)
  }

  async validate({ auth, response }: HttpContext) {
    const user = auth.user
    response.send(user)
  }
}
