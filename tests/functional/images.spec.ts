import { test } from '@japa/runner'
import { VariantFactory } from '#database/factories/variant_factory'
import { resolve, join } from 'path'

test.group('Images', () => {
  test('store an image', async ({ client, route, assert }) => {
    const __dirname = resolve()
    const filePath = join(__dirname, '/tests/pic.png')

    const variant = await VariantFactory.create()
    const variantJson = variant.serialize()

    const response = await client
      .post(route('variants.images.store', [variantJson.id]))
      .file('image', filePath)
    const responseBody = response.body()

    assert.include(responseBody.name, '.png')
    response.assertStatus(200)
    response.assertAgainstApiSpec()
  })

  test('update an image', async ({ client, route, assert }) => {
    const __dirname = resolve()
    const filePath = join(__dirname, '/tests/pic.png')

    const variant = await VariantFactory.with('images', 1).create()
    const variantJson = variant.serialize()

    const storeImageResponse = await client
      .post(route('variants.images.store', [variantJson.id]))
      .file('image', filePath)
    const storeImageBody = storeImageResponse.body()

    const response = await client
      .put(route('variants.images.update', [variantJson.id, storeImageBody.id]))
      .file('image', filePath)
    const responseBody = response.body()

    assert.include(responseBody.name, '.png')
    response.assertStatus(200)
    response.assertAgainstApiSpec()
  })

  test('delete an image', async ({ client, route, assert }) => {
    const __dirname = resolve()
    const filePath = join(__dirname, '/tests/pic.png')

    const variant = await VariantFactory.with('images', 1).create()
    const variantJson = variant.serialize()

    const storeImageResponse = await client
      .post(route('variants.images.store', [variantJson.id]))
      .file('image', filePath)
    const storeImageBody = storeImageResponse.body()

    const response = await client.delete(
      route('variants.images.destroy', [variantJson.id, storeImageBody.id])
    )

    assert.equal(response.text(), `id of deleted image: ${storeImageBody.id}`)
  })
})
