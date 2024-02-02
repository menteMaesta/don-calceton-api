import { test } from '@japa/runner'
import { VariantFactory } from '#database/factories/variant_factory'
import { ProductFactory } from '#database/factories/product_factory'
import type Variant from '#models/variant'
import type Image from '#models/image'

test.group('Variants', () => {
  test('get a list of variants', async ({ client, route, assert }) => {
    const product = await ProductFactory.with('variants', 4).create()
    const productJson = product.serialize()

    const response = await client.get(route('products.variants.index', [productJson.id]))
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    response.assertBodyContains(productJson.variants)
    assert.lengthOf(responseBody, productJson.variants.length)
    responseBody.forEach((variant: Variant, key: number) => {
      assert.include(variant, productJson.variants[key])
    })
  })

  test('store a variant', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()
    const productJson = product.serialize()
    const newVariant = await VariantFactory.makeStubbed()
    const variantJson = newVariant.serialize()

    const response = await client
      .post(route('products.variants.store', [productJson.id]))
      .json(variantJson)
    const responseBody = response.body()

    assert.equal(responseBody.name, variantJson.name)
    assert.equal(responseBody.quantity, variantJson.quantity)

    response.assertAgainstApiSpec()
  })

  test('show variant', async ({ client, route, assert }) => {
    const product = await ProductFactory.with('variants', 1, (variant) =>
      variant.with('images', 3)
    ).create()
    const productJson = product.serialize()

    const response = await client.get(
      route('products.variants.show', [productJson.id, productJson.variants[0].id])
    )
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    assert.lengthOf(responseBody.images, productJson.variants[0].images.length)
    assert.equal(responseBody.name, productJson.variants[0].name)
    assert.equal(responseBody.quantity, productJson.variants[0].quantity)
    responseBody.images.forEach((image: Image, key: number) => {
      assert.equal(image.name, productJson.variants[0].images[key].name)
    })
  })

  test('update variant', async ({ client, route, assert }) => {
    const product = await ProductFactory.with('variants', 1).create()
    const productJson = product.serialize()
    const newVariant = await VariantFactory.makeStubbed()
    const variantJson = newVariant.serialize()

    const response = await client
      .put(route('products.variants.update', [productJson.id, productJson.variants[0].id]))
      .json(variantJson)
    const responseBody = response.body()

    response.assertAgainstApiSpec()
    assert.equal(responseBody.name, variantJson.name)
    assert.equal(responseBody.quantity, variantJson.quantity)
  })

  test('destroy variant', async ({ client, route, assert }) => {
    const product = await ProductFactory.with('variants', 1).create()
    const productJson = product.serialize()

    const response = await client.delete(
      route('products.variants.destroy', [productJson.id, productJson.variants[0].id])
    )

    assert.equal(response.text(), `id of deleted variant: ${productJson.variants[0].id}`)
  })
})
