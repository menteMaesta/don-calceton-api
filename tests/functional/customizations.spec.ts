import { test } from '@japa/runner'
import { VariantFactory } from '#database/factories/variant_factory'
import { CustomizationFactory } from '#database/factories/customization_factory'
import { createAdminUser } from '#tests/functional/helpers'
import Customization from '#models/customization'

type SerializedCustomization = Omit<Customization, 'max_size' | 'min_size'> & {
  maxSize: number
  minSize: number
}
test.group('Customizations', () => {
  test('list customizations', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const variant = await VariantFactory.with('customizations', 3).create()
    const variantJson = variant.serialize()

    const response = await client
      .get(route('variants.customizations.index', [variant.id]))
      .json(variantJson.customizations)
      .loginAs(admin)
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    responseBody.forEach((customization: SerializedCustomization, key: number) => {
      assert.equal(customization.id, variantJson.customizations[key].id)
      assert.equal(customization.title, variantJson.customizations[key].title)
      assert.equal(customization.maxSize, variantJson.customizations[key].maxSize)
      assert.equal(customization.minSize, variantJson.customizations[key].minSize)
    })
  })

  test('store a customization', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const variant = await VariantFactory.create()
    const customization = await CustomizationFactory.makeStubbed()
    const customizationJson = customization.serialize()

    const response = await client
      .post(route('variants.customizations.store', [variant.id]))
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
    const variant = await VariantFactory.with('customizations', 1).create()
    const variantJson = variant.serialize()
    const updatedCustomization = await CustomizationFactory.makeStubbed()
    const updatedCustomizationJson = updatedCustomization.serialize()

    const response = await client
      .put(
        route('variants.customizations.update', [variantJson.id, variantJson.customizations[0].id])
      )
      .json(updatedCustomizationJson)
      .loginAs(admin)
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    assert.equal(responseBody.id, variantJson.customizations[0].id)
    assert.equal(responseBody.title, updatedCustomizationJson.title)
    assert.equal(responseBody.maxSize, updatedCustomizationJson.maxSize)
    assert.equal(responseBody.minSize, updatedCustomizationJson.minSize)
  })

  test('destroy customization', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const variant = await VariantFactory.with('customizations', 1).create()
    const variantJson = variant.serialize()

    const response = await client
      .delete(
        route('variants.customizations.destroy', [variantJson.id, variantJson.customizations[0].id])
      )
      .loginAs(admin)

    response.assertAgainstApiSpec()
    assert.equal(
      response.body().message,
      `id of deleted customization: ${variantJson.customizations[0].id}`
    )
  })
})
