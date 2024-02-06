import { UserFactory } from '#database/factories/user_factory'

export const createAdminUser = async () => {
  const adminUser = await UserFactory.merge({ admin: true }).create()
  return adminUser
}
