import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { createAdminUser } from '#tests/functional/helpers'

test.group('Users', () => {
  test('store a user', async ({ client, route, assert }) => {
    const user = await UserFactory.makeStubbed()
    const userJson = user.serialize()

    const response = await client.post(route('users.store')).json(user)
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    assert.equal(responseBody.fullName, userJson.fullName)
    assert.equal(responseBody.email, userJson.email.toLowerCase())
    assert.equal(responseBody.admin, userJson.admin)
  }).skip(true, 'Skiped because this endpoint was intentionally disabled')

  test('update a user', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const user = await UserFactory.create()

    const newUser = await UserFactory.makeStubbed()
    const newUserJson = newUser.serialize()

    const response = await client
      .put(route('users.update', [user.id]))
      .json(newUserJson)
      .loginAs(admin)
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    assert.equal(responseBody.fullName, newUserJson.fullName)
    assert.equal(responseBody.admin, newUserJson.admin)
    assert.notEqual(user.password, newUser.password)
  })

  test('destroy user', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const user = await UserFactory.create()
    const userJson = user.serialize()

    const response = await client.delete(route('users.destroy', [userJson.id])).loginAs(admin)

    assert.equal(response.text(), `id of deleted user: ${userJson.id}`)
  })
})
