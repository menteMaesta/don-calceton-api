import { readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { UserFactory } from '#database/factories/user_factory'
import env from '#start/env'

export const createAdminUser = async () => {
  const adminUser = await UserFactory.merge({ admin: true }).create()
  return adminUser
}

export const removeImages = async () => {
  try {
    const files = await readdir(env.get('UPLOADS_PATH'))
    for (const file of files) {
      await unlink(join(env.get('UPLOADS_PATH'), file))
    }
  } catch (error) {
    throw error
  }
}
