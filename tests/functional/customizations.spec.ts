import { test } from '@japa/runner'
import { VariantFactory } from '#database/factories/variant_factory'
import { CustomizationFactory } from '#database/factories/customization_factory'
import { createAdminUser } from '#tests/functional/helpers'

test.group('Customizations', () => {
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
    assert.equal(responseBody.id, updatedCustomizationJson.id)
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
