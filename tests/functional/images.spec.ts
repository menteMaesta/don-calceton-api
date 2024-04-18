import { test } from '@japa/runner'
import { VariantFactory } from '#database/factories/variant_factory'
import { resolve, join } from 'node:path'
import { createAdminUser, removeImages } from '#tests/functional/helpers'

test.group('Images', (group) => {
  group.teardown(async () => {
    await removeImages()
  })
  test('store an image', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const dirname = resolve()
    const filePath = join(dirname, '/tests/pic.png')

    const variant = await VariantFactory.create()
    const variantJson = variant.serialize()

    const response = await client
      .post(route('variants.images.store', [variantJson.id]))
      .file('image', filePath)
      .loginAs(admin)
    const responseBody = response.body()

    assert.include(responseBody.name, '.png')
    response.assertStatus(200)
    response.assertAgainstApiSpec()
  })

  test('update an image', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const dirname = resolve()
    const filePath = join(dirname, '/tests/pic.png')

    const variant = await VariantFactory.with('images', 1).create()
    const variantJson = variant.serialize()

    const storeImageResponse = await client
      .post(route('variants.images.store', [variantJson.id]))
      .file('image', filePath)
      .loginAs(admin)
    const storeImageBody = storeImageResponse.body()

    const response = await client
      .put(route('variants.images.update', [variantJson.id, storeImageBody.id]))
      .file('image', filePath)
      .loginAs(admin)
    const responseBody = response.body()

    assert.include(responseBody.name, '.png')
    response.assertStatus(200)
    response.assertAgainstApiSpec()
  })

  test('delete an image', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const dirname = resolve()
    const filePath = join(dirname, '/tests/pic.png')

    const variant = await VariantFactory.with('images', 1).create()
    const variantJson = variant.serialize()

    const storeImageResponse = await client
      .post(route('variants.images.store', [variantJson.id]))
      .file('image', filePath)
      .loginAs(admin)
    const storeImageBody = storeImageResponse.body()

    const response = await client
      .delete(route('variants.images.destroy', [variantJson.id, storeImageBody.id]))
      .loginAs(admin)

    assert.equal(response.body().message, `id of deleted image: ${storeImageBody.id}`)
  })
})
