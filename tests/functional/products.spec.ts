import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Variant from '#models/variant'
import { ProductFactory } from '#database/factories/product_factory'
import { createAdminUser } from '#tests/functional/helpers'

test.group('Products', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('get a list of products', async ({ client, route }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('variants', 1, (variant) =>
      variant.with('images', 1)
    ).create()
    const productJson = product.serialize()
    productJson.variants = productJson.variants.map((variant: Variant) => ({
      id: variant.images[0].id,
      name: variant.images[0].name,
    }))

    const response = await client.get(route('products.index')).loginAs(admin)
    response.assertAgainstApiSpec()
    response.assertBodyContains([productJson])
  })

  test('store a product', async ({ client, route }) => {
    const admin = await createAdminUser()
    const newProductData = {
      name: 'product 1',
      description: 'description for product 1',
      price: 10,
      wholesalePrice: 5,
    }

    const response = await client.post(route('products.store')).json(newProductData).loginAs(admin)

    response.assertAgainstApiSpec()
    response.assertBodyContains(newProductData)
  })

  test('get a product', async ({ client, route }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('variants', 1).create()
    const productsJson = product.serialize()

    const response = await client.get(route('products.show', [productsJson.id])).loginAs(admin)

    response.assertAgainstApiSpec()
    response.assertBodyContains(productsJson)
  })

  test('update a product', async ({ client, route }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('variants', 1).create()
    const productsJson = product.serialize()
    const productMods = {
      name: 'New product name',
      description: 'new description',
      price: 50,
      wholesalePrice: 25,
    }

    const response = await client
      .put(route('products.update', [productsJson.id]))
      .json(productMods)
      .loginAs(admin)

    response.assertAgainstApiSpec()
    response.assertBodyContains(productMods)
  })

  test('destroy a product', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('variants', 1).create()
    const productsJson = product.serialize()

    const response = await client
      .delete(route('products.destroy', [productsJson.id]))
      .loginAs(admin)
    assert.equal(response.body().message, `id of deleted product: ${productsJson.id}`)
  })
})
