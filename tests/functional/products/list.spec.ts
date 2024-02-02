import { test } from '@japa/runner'
import { ProductFactory } from '#database/factories/product_factory'

test.group('Products list', () => {
  test('get a list of products', async ({ client, route }) => {
    const product = await ProductFactory.with('variants', 1).create()
    const productsJson = product.serialize()

    const response = await client.get(route('products.index'))

    response.assertAgainstApiSpec()
    response.assertBodyContains([productsJson])
  })
})
