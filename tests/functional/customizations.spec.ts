import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { ProductFactory } from '#database/factories/product_factory'
import { CustomizationFactory } from '#database/factories/customization_factory'
import { createAdminUser } from '#tests/functional/helpers'
import Customization from '#models/customization'

type SerializedCustomization = Omit<Customization, 'max_size' | 'min_size'> & {
  maxSize: number
  minSize: number
}
test.group('Customizations', (group) => {
  group.each.setup(() => testUtils.db().truncate())
  test('list customizations', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('customizations', 3).create()
    const productJson = product.serialize()

    const response = await client
      .get(route('products.customizations.index', [product.id]))
      .json(productJson.customizations)
      .loginAs(admin)
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    responseBody.forEach((customization: SerializedCustomization, key: number) => {
      assert.equal(customization.id, productJson.customizations[key].id)
      assert.equal(customization.title, productJson.customizations[key].title)
      assert.equal(customization.maxSize, productJson.customizations[key].maxSize)
      assert.equal(customization.minSize, productJson.customizations[key].minSize)
    })
  })

  test('store a customization', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.create()
    const customization = await CustomizationFactory.makeStubbed()
    const customizationJson = customization.serialize()

    const response = await client
      .post(route('products.customizations.store', [product.id]))
      .json(customizationJson)
      .loginAs(admin)
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    assert.equal(responseBody.title, customizationJson.title)
    assert.equal(responseBody.maxSize, customizationJson.maxSize)
    assert.equal(responseBody.minSize, customizationJson.minSize)
  })

  test('update a customization', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('customizations', 1).create()
    const productJson = product.serialize()
    const updatedCustomization = await CustomizationFactory.makeStubbed()
    const updatedCustomizationJson = updatedCustomization.serialize()

    const response = await client
      .put(
        route('products.customizations.update', [productJson.id, productJson.customizations[0].id])
      )
      .json(updatedCustomizationJson)
      .loginAs(admin)
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    assert.equal(responseBody.id, productJson.customizations[0].id)
    assert.equal(responseBody.title, updatedCustomizationJson.title)
    assert.equal(responseBody.maxSize, updatedCustomizationJson.maxSize)
    assert.equal(responseBody.minSize, updatedCustomizationJson.minSize)
  })

  test('destroy customization', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('customizations', 1).create()
    const productJson = product.serialize()

    const response = await client
      .delete(
        route('products.customizations.destroy', [productJson.id, productJson.customizations[0].id])
      )
      .loginAs(admin)

    response.assertAgainstApiSpec()
    assert.equal(
      response.body().message,
      `id of deleted customization: ${productJson.customizations[0].id}`
    )
  })
})
