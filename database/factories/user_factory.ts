import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      admin: faker.datatype.boolean(),
      password: faker.internet.password(),
    }
  })
  .build()
