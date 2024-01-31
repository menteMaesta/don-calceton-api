import { test } from '@japa/runner'
import { ProductFactory } from '#database/factories/product_factory'

test.group('Products list', () => {
  test('get a list of products', async ({ client, route, assert }) => {
    await ProductFactory.with('variants', 3, (variant) => variant.with('images', 3)).create()

    const response = await client.get(route('products.index'))
    response.assertAgainstApiSpec()
  })
})
